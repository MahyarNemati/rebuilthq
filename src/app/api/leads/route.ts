import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads, tenants } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const LeadSchema = z.object({
  tenantSlug: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  needs: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = LeadSchema.parse(await req.json());

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, body.tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const [lead] = await db
      .insert(leads)
      .values({
        tenantId: tenant.id,
        name: body.name,
        email: body.email,
        company: body.company || null,
        needs: body.needs || null,
        score: 5,
      })
      .returning();

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Lead error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
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
    console.error("Leads fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
