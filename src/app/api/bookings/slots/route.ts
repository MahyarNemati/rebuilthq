import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`slots:${ip}`, 30, 60_000);
    if (!allowed) return rateLimitedResponse();

    const startDate = req.nextUrl.searchParams.get("start");
    const days = parseInt(req.nextUrl.searchParams.get("days") || "14", 10);

    // Default to tomorrow if no start date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = startDate || tomorrow.toISOString().split("T")[0];

    const slots = await getAvailableSlots(start, Math.min(days, 30));

    return NextResponse.json({ success: true, slots });
  } catch (err) {
    console.error("Slots error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}
