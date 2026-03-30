import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateContent } from "@/lib/claude";

const GenerateSchema = z.object({
  type: z.enum(["ad_copy", "seo", "social", "email"]),
  product: z.string().min(1).max(1000),
  audience: z.string().min(1).max(500),
  tone: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
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
    console.error("Content generation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
