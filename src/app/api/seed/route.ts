import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { TENANT_DEFAULTS } from "@/lib/tenants";

export async function POST() {
  try {
    // Seed all tenants
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
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
