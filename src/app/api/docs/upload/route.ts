import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { processDocument } from "@/lib/documents";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

const UploadSchema = z.object({
  tenantSlug: z.string().min(1),
});

const ALLOWED_TYPES = new Set([".pdf", ".docx", ".txt"]);
const ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 uploads per minute per IP
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`upload:${ip}`, 3, 60_000);
    if (!allowed) return rateLimitedResponse();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tenantSlug = formData.get("tenantSlug") as string | null;

    if (!file || !tenantSlug) {
      return NextResponse.json(
        { error: "file and tenantSlug are required" },
        { status: 400 }
      );
    }

    UploadSchema.parse({ tenantSlug });

    // Validate file extension
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ALLOWED_TYPES.has(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${Array.from(ALLOWED_TYPES).join(", ")}` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (file.type && !ALLOWED_MIMES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file MIME type" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    // Sanitize filename — strip path traversal, limit length
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 100);

    // Get tenant
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Process document
    const buffer = Buffer.from(await file.arrayBuffer());
    const docId = await processDocument(tenant.id, sanitizedName, buffer);

    return NextResponse.json({
      success: true,
      documentId: docId,
      filename: sanitizedName,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Upload error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
