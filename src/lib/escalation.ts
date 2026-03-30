import { db } from "./db";
import { conversations } from "./db/schema";
import { eq } from "drizzle-orm";

export async function escalateConversation(
  conversationId: string,
  summary: string,
  tenantName: string,
  contactEmail?: string,
  slackWebhookUrl?: string
) {
  // Update conversation status
  await db
    .update(conversations)
    .set({ status: "escalated", updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  // Send Slack notification
  if (slackWebhookUrl) {
    try {
      await fetch(slackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 *Escalation from ${tenantName}*\n\n${summary}\n\nConversation ID: ${conversationId}`,
        }),
      });
    } catch (err) {
      console.error("Slack notification failed:", err);
    }
  }

  // Send email notification (simplified — use a proper email service in production)
  if (contactEmail) {
    // TODO: Integrate with SendGrid/Resend for email notifications
    console.log(`Email escalation to ${contactEmail}: ${summary}`);
  }
}

export async function captureLead(data: {
  tenantId: string;
  name: string;
  email: string;
  company?: string;
  needs?: string;
  score?: number;
  conversationId?: string;
}) {
  const { leads } = await import("./db/schema");

  const [lead] = await db
    .insert(leads)
    .values({
      tenantId: data.tenantId,
      name: data.name,
      email: data.email,
      company: data.company || null,
      needs: data.needs || null,
      score: data.score || 5,
      conversationId: data.conversationId || null,
    })
    .returning();

  return lead;
}
