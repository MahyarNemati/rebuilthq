import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/claude";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/auth";

const GenerateSchema = z.object({
  type: z.enum(["ad_copy", "seo", "social", "email"]),
  product: z.string().min(1).max(1000),
  audience: z.string().min(1).max(500),
  tone: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { allowed } = rateLimit(`content:${ip}`, 5, 60_000);
    if (!allowed) return rateLimitedResponse();

    const body = GenerateSchema.parse(await req.json());

    const prompt = `Product/Service: ${body.product}
Target Audience: ${body.audience}
${body.tone ? `Tone: ${body.tone}` : "Tone: Professional and engaging"}

Generate compelling ${body.type.replace("_", " ")} for this product/service.`;

    const results = await generateContent(prompt, body.type);

    return NextResponse.json({
      success: true,
      type: body.type,
      results,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("Content generation error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
