import { db } from "./db";
import { bookings, availabilityConfig, blockedDates } from "./db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export type TimeSlot = {
  time: string; // "10:00"
  available: boolean;
};

export type DaySlots = {
  date: string; // "2026-04-02"
  dayOfWeek: number;
  dayName: string;
  slots: TimeSlot[];
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default availability if DB has no config yet
const DEFAULT_AVAILABILITY: Record<number, { start: string; end: string; duration: number }> = {
  1: { start: "10:00", end: "17:00", duration: 30 }, // Mon
  2: { start: "10:00", end: "17:00", duration: 30 }, // Tue
  3: { start: "10:00", end: "17:00", duration: 30 }, // Wed
  4: { start: "10:00", end: "17:00", duration: 30 }, // Thu
  5: { start: "10:00", end: "16:00", duration: 30 }, // Fri
};

function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    current += durationMinutes;
  }

  return slots;
}

export async function getAvailableSlots(startDate: string, days: number = 14): Promise<DaySlots[]> {
  // Get availability config from DB
  let config: { dayOfWeek: number; startTime: string; endTime: string; slotDurationMinutes: number; isActive: boolean | null }[];
  try {
    config = await db.select().from(availabilityConfig);
  } catch {
    config = [];
  }

  // Get blocked dates
  let blocked: { date: string }[];
  try {
    blocked = await db.select({ date: blockedDates.date }).from(blockedDates);
  } catch {
    blocked = [];
  }
  const blockedSet = new Set(blocked.map((b) => b.date));

  // Get existing bookings in range
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  const endDateStr = endDate.toISOString().split("T")[0];

  let existingBookings: { date: string; time: string }[];
  try {
    existingBookings = await db
      .select({ date: bookings.date, time: bookings.time })
      .from(bookings)
      .where(
        and(
          gte(bookings.date, startDate),
          lte(bookings.date, endDateStr),
          eq(bookings.status, "confirmed")
        )
      );
  } catch {
    existingBookings = [];
  }

  const bookedMap = new Map<string, Set<string>>();
  for (const b of existingBookings) {
    if (!bookedMap.has(b.date)) bookedMap.set(b.date, new Set());
    bookedMap.get(b.date)!.add(b.time);
  }

  // Build availability map from config or defaults
  const availMap: Record<number, { start: string; end: string; duration: number }> = {};
  if (config.length > 0) {
    for (const c of config) {
      if (c.isActive) {
        availMap[c.dayOfWeek] = { start: c.startTime, end: c.endTime, duration: c.slotDurationMinutes };
      }
    }
  } else {
    Object.assign(availMap, DEFAULT_AVAILABILITY);
  }

  // Generate slots for each day
  const result: DaySlots[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const dateStr = current.toISOString().split("T")[0];
    const dow = current.getDay();
    const dayConfig = availMap[dow];

    if (dayConfig && !blockedSet.has(dateStr)) {
      const allSlots = generateSlots(dayConfig.start, dayConfig.end, dayConfig.duration);
      const bookedTimes = bookedMap.get(dateStr) || new Set();

      // Filter out past times for today
      const now = new Date();
      const isToday = dateStr === now.toISOString().split("T")[0];

      const slots: TimeSlot[] = allSlots.map((time) => {
        let available = !bookedTimes.has(time);

        if (isToday) {
          const [h, m] = time.split(":").map(Number);
          const slotTime = new Date(now);
          slotTime.setHours(h, m, 0, 0);
          if (slotTime <= now) available = false;
        }

        return { time, available };
      });

      if (slots.some((s) => s.available)) {
        result.push({
          date: dateStr,
          dayOfWeek: dow,
          dayName: DAY_NAMES[dow],
          slots,
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return result;
}

export async function createBooking(data: {
  name: string;
  email: string;
  company?: string;
  notes?: string;
  date: string;
  time: string;
  timezone?: string;
}): Promise<{ id: string; icsContent: string }> {
  // Double-check the slot is still available
  const existing = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.date, data.date),
        eq(bookings.time, data.time),
        eq(bookings.status, "confirmed")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("This time slot is no longer available. Please choose another.");
  }

  const [booking] = await db
    .insert(bookings)
    .values({
      name: data.name,
      email: data.email,
      company: data.company || null,
      notes: data.notes || null,
      date: data.date,
      time: data.time,
      timezone: data.timezone || "America/Toronto",
    })
    .returning();

  // Generate .ics calendar file
  const icsContent = generateICS(booking.id, data);

  return { id: booking.id, icsContent };
}

export async function cancelBooking(bookingId: string, email: string): Promise<boolean> {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.email, email)))
    .limit(1);

  if (!booking || booking.status !== "confirmed") return false;

  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, bookingId));

  return true;
}

function generateICS(id: string, data: { name: string; email: string; date: string; time: string; notes?: string }): string {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);

  // Format for ICS: YYYYMMDDTHHMMSS
  const dtStart = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
  const endHour = hour;
  const endMinute = minute + 30;
  const dtEnd = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(endHour).padStart(2, "0")}${String(endMinute).padStart(2, "0")}00`;

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RebuiltHQ//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${id}@rebuilthq.com`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Toronto:${dtStart}`,
    `DTEND;TZID=America/Toronto:${dtEnd}`,
    "SUMMARY:RebuiltHQ Free Consultation",
    `DESCRIPTION:Free AI consultation with RebuiltHQ.\\n\\nName: ${data.name}\\nEmail: ${data.email}${data.notes ? `\\nNotes: ${data.notes}` : ""}`,
    "LOCATION:Video Call (link will be sent via email)",
    `ORGANIZER;CN=RebuiltHQ:mailto:hello@rebuilthq.com`,
    `ATTENDEE;CN=${data.name}:mailto:${data.email}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:RebuiltHQ consultation in 30 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
