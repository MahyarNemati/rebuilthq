import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tenants, conversations, messages } from "@/lib/db/schema";
import { chat, type ChatMessage } from "@/lib/claude";
import { eq, and } from "drizzle-orm";
import { lookupOrder, getProducts, formatProductsForContext } from "@/lib/shopify";
import { escalateConversation, captureLead } from "@/lib/escalation";
import { queryDocuments } from "@/lib/documents";

const ChatRequestSchema = z.object({
  tenantSlug: z.string().min(1),
  sessionId: z.string().min(1),
  message: z.string().min(1).max(5000),
  customerEmail: z.string().email().optional(),
  orderNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = ChatRequestSchema.parse(await req.json());

    // Get tenant
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, body.tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Get or create conversation
    let [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.tenantId, tenant.id),
          eq(conversations.sessionId, body.sessionId)
        )
      )
      .limit(1);

    if (!conversation) {
      [conversation] = await db
        .insert(conversations)
        .values({
          tenantId: tenant.id,
          sessionId: body.sessionId,
          customerEmail: body.customerEmail || null,
          status: "active",
        })
        .returning();
    }

    // Save user message
    await db.insert(messages).values({
      conversationId: conversation.id,
      role: "user",
      content: body.message,
    });

    // Get conversation history
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id));

    // Build context based on tenant type
    let systemPrompt = tenant.systemPrompt;

    if (tenant.type === "shopify") {
      try {
        const config = tenant.config as { shopifyDomain?: string; shopifyAccessToken?: string } | null;
        const products = await getProducts(
          config?.shopifyDomain,
          config?.shopifyAccessToken
        );
        systemPrompt += `\n\nAvailable products:\n${formatProductsForContext(products)}`;
      } catch {
        // Products unavailable — continue without
      }

      // Handle order lookup if email and order number provided
      if (body.customerEmail && body.orderNumber) {
        try {
          const config = tenant.config as { shopifyDomain?: string; shopifyAccessToken?: string } | null;
          const order = await lookupOrder(
            body.customerEmail,
            body.orderNumber,
            config?.shopifyDomain,
            config?.shopifyAccessToken
          );
          if (order) {
            systemPrompt += `\n\nCustomer's order info:\n${JSON.stringify(order, null, 2)}`;
          } else {
            systemPrompt += `\n\nNote: No order found for email ${body.customerEmail} and order #${body.orderNumber}`;
          }
        } catch {
          // Order lookup failed — continue
        }
      }
    }

    if (tenant.type === "legal") {
      // Check if message is a document query
      const docAnswer = await queryDocuments(tenant.id, body.message);
      if (docAnswer && !docAnswer.includes("No documents")) {
        systemPrompt += `\n\nRelevant document context:\n${docAnswer}`;
      }
    }

    // Build messages for Claude
    const chatMessages: ChatMessage[] = history
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Get Claude response
    const response = await chat(systemPrompt, chatMessages);

    // Check for escalation
    if (response.includes("[ESCALATE]")) {
      const summary = `Customer needs human assistance.\nLast message: ${body.message}\nConversation: ${conversation.id}`;
      await escalateConversation(
        conversation.id,
        summary,
        tenant.name,
        tenant.contactEmail || undefined,
        tenant.slackWebhookUrl || undefined
      );
    }

    // Check for lead capture (agency tenant)
    if (response.includes("[LEAD_CAPTURED]")) {
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const leadData = JSON.parse(jsonMatch[0]);
          await captureLead({
            tenantId: tenant.id,
            name: leadData.name || "Unknown",
            email: leadData.email || "",
            company: leadData.company,
            needs: leadData.needs,
            score: leadData.score || 7,
            conversationId: conversation.id,
          });
        }
      } catch {
        // Lead parsing failed — continue
      }
    }

    // Clean response of internal markers
    const cleanResponse = response
      .replace("[ESCALATE]", "")
      .replace(/\[LEAD_CAPTURED\][\s\S]*$/, "")
      .trim();

    // Save assistant message
    await db.insert(messages).values({
      conversationId: conversation.id,
      role: "assistant",
      content: cleanResponse,
    });

    return NextResponse.json({
      success: true,
      message: cleanResponse,
      conversationId: conversation.id,
      escalated: response.includes("[ESCALATE]"),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
