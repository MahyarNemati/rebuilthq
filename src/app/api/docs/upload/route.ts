import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { processDocument } from "@/lib/documents";

const UploadSchema = z.object({
  tenantSlug: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
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

    // Validate file type
    const allowedTypes = [".pdf", ".docx", ".txt"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

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
    const docId = await processDocument(tenant.id, file.name, buffer);

    return NextResponse.json({
      success: true,
      documentId: docId,
      filename: file.name,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
