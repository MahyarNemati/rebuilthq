import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants, availabilityConfig } from "@/lib/db/schema";
import { TENANT_DEFAULTS } from "@/lib/tenants";
import { validateApiKey, unauthorizedResponse, rateLimitedResponse } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!validateApiKey(req)) return unauthorizedResponse();

    const ip = getClientIp(req);
    const { allowed } = rateLimit(`seed:${ip}`, 1, 3_600_000);
    if (!allowed) return rateLimitedResponse();

    // Seed tenants
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

    // Seed default booking availability (Mon-Fri, 10am-5pm, 30min slots)
    const defaultAvailability = [
      { dayOfWeek: 1, startTime: "10:00", endTime: "17:00", slotDurationMinutes: 30 }, // Mon
      { dayOfWeek: 2, startTime: "10:00", endTime: "17:00", slotDurationMinutes: 30 }, // Tue
      { dayOfWeek: 3, startTime: "10:00", endTime: "17:00", slotDurationMinutes: 30 }, // Wed
      { dayOfWeek: 4, startTime: "10:00", endTime: "17:00", slotDurationMinutes: 30 }, // Thu
      { dayOfWeek: 5, startTime: "10:00", endTime: "16:00", slotDurationMinutes: 30 }, // Fri
    ];

    for (const avail of defaultAvailability) {
      await db.insert(availabilityConfig).values(avail).onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      message: "Seeded 3 tenants + booking availability (Mon-Fri 10am-5pm)",
    });
  } catch (err) {
    console.error("Seed error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
