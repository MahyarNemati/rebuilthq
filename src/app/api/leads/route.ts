import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads, tenants } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse, validateApiKey, unauthorizedResponse } from "@/lib/auth";

const LeadSchema = z.object({
  tenantSlug: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  needs: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 leads per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`lead:${ip}`, 10, 60_000);
    if (!allowed) return rateLimitedResponse();

    const body = LeadSchema.parse(await req.json());

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, body.tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    await db
      .insert(leads)
      .values({
        tenantId: tenant.id,
        name: body.name,
        email: body.email,
        company: body.company || null,
        needs: body.needs || null,
        score: 5,
      });

    // Return minimal info — don't expose internal IDs
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Lead error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET requires admin API key
export async function GET(req: NextRequest) {
  try {
    if (!validateApiKey(req)) return unauthorizedResponse();

    const tenantSlug = req.nextUrl.searchParams.get("tenantSlug");
    if (!tenantSlug) {
      return NextResponse.json({ error: "tenantSlug required" }, { status: 400 });
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const allLeads = await db
      .select()
      .from(leads)
      .where(eq(leads.tenantId, tenant.id))
      .orderBy(desc(leads.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, leads: allLeads });
  } catch (err) {
    console.error("Leads fetch error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
