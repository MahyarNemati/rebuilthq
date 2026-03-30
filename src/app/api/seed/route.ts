import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { TENANT_DEFAULTS } from "@/lib/tenants";
import { validateApiKey, unauthorizedResponse } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Require admin API key
    if (!validateApiKey(req)) return unauthorizedResponse();

    // Rate limit: 1 seed per hour
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`seed:${ip}`, 1, 3_600_000);
    if (!allowed) return rateLimitedResponse();

    for (const [, config] of Object.entries(TENANT_DEFAULTS)) {
      await db
        .insert(tenants)
        .values({
          name: config.name,
          slug: config.slug,
          type: config.type,
          systemPrompt: config.systemPrompt,
          widgetConfig: config.widgetConfig,
        })
        .onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      message: "Seeded 3 tenants: ntrl, ramezghalylaw, rebuilthq",
    });
  } catch (err) {
    console.error("Seed error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
