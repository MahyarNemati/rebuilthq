import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBooking, cancelBooking } from "@/lib/booking";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

const BookingSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().max(50).optional(),
});

const CancelSchema = z.object({
  bookingId: z.string().uuid(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`booking:${ip}`, 3, 60_000);
    if (!allowed) return rateLimitedResponse();

    const body = BookingSchema.parse(await req.json());

    // Validate date is in the future
    const bookingDate = new Date(`${body.date}T${body.time}:00`);
    if (bookingDate <= new Date()) {
      return NextResponse.json({ error: "Cannot book a time in the past" }, { status: 400 });
    }

    // Validate date is within 30 days
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (bookingDate > maxDate) {
      return NextResponse.json({ error: "Cannot book more than 30 days ahead" }, { status: 400 });
    }

    const result = await createBooking(body);

    return NextResponse.json({
      success: true,
      bookingId: result.id,
      icsContent: result.icsContent,
      message: `Consultation booked for ${body.date} at ${body.time}`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    if (err instanceof Error && err.message.includes("no longer available")) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Booking error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`cancel:${ip}`, 5, 60_000);
    if (!allowed) return rateLimitedResponse();

    const body = CancelSchema.parse(await req.json());
    const success = await cancelBooking(body.bookingId, body.email);

    if (!success) {
      return NextResponse.json({ error: "Booking not found or already cancelled" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Cancel error:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
