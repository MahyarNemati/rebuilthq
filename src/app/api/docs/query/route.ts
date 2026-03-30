import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queryDocuments } from "@/lib/documents";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

const QuerySchema = z.object({
  tenantSlug: z.string().min(1),
  question: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 queries per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`docquery:${ip}`, 10, 60_000);
    if (!allowed) return rateLimitedResponse();

    const body = QuerySchema.parse(await req.json());

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, body.tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const answer = await queryDocuments(tenant.id, body.question);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Query error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
