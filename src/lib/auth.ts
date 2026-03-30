import { NextResponse } from "next/server";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export function validateApiKey(request: Request): boolean {
  if (!ADMIN_API_KEY) return true; // Skip if not configured
  const key = request.headers.get("x-api-key");
  return key === ADMIN_API_KEY;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

export function rateLimitedResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
