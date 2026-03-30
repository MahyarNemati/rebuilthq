import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chat(
  systemPrompt: string,
  messages: ChatMessage[],
  tools?: Anthropic.Tool[]
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
    ...(tools && tools.length > 0 ? { tools } : {}),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : "";
}

export async function streamChat(
  systemPrompt: string,
  messages: ChatMessage[],
  tools?: Anthropic.Tool[]
) {
  return anthropic.messages.stream({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
    ...(tools && tools.length > 0 ? { tools } : {}),
  });
}

export async function generateContent(
  prompt: string,
  type: "ad_copy" | "seo" | "social" | "email"
): Promise<string[]> {
  const typePrompts: Record<string, string> = {
    ad_copy: "Generate 5 compelling ad copy variations. Return each variation on a new line separated by ---",
    seo: "Generate 3 SEO-optimized content pieces. Return each separated by ---",
    social: "Generate 5 social media post variations. Return each separated by ---",
    email: "Generate 5 email subject line variations followed by a short body. Return each separated by ---",
  };

  const response = await chat(
    `You are an expert marketing copywriter. ${typePrompts[type]}`,
    [{ role: "user", content: prompt }]
  );

  return response.split("---").map((s) => s.trim()).filter(Boolean);
}

// anthropic client kept private to this module
