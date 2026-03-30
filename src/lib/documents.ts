import { db } from "./db";
import { documents, documentChunks } from "./db/schema";
import { eq } from "drizzle-orm";
import { chat } from "./claude";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export async function processDocument(
  tenantId: string,
  filename: string,
  buffer: Buffer
): Promise<string> {
  // Create document record
  const [doc] = await db
    .insert(documents)
    .values({
      tenantId,
      filename,
      status: "processing",
    })
    .returning();

  try {
    let text = "";

    if (filename.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (filename.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (filename.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else {
      throw new Error(`Unsupported file type: ${filename}`);
    }

    // Update document with extracted text
    await db
      .update(documents)
      .set({ contentText: text, status: "ready" })
      .where(eq(documents.id, doc.id));

    // Chunk the text
    const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);

    // Store chunks
    for (let i = 0; i < chunks.length; i++) {
      await db.insert(documentChunks).values({
        documentId: doc.id,
        content: chunks[i],
        chunkIndex: i,
      });
    }

    return doc.id;
  } catch (err) {
    await db
      .update(documents)
      .set({ status: "error" })
      .where(eq(documents.id, doc.id));
    throw err;
  }
}

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start += size - overlap;
  }

  return chunks;
}

export async function queryDocuments(
  tenantId: string,
  question: string
): Promise<string> {
  // Get all chunks for this tenant's documents (simple approach — no vector search for v1)
  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.tenantId, tenantId));

  if (docs.length === 0) {
    return "No documents have been uploaded yet. Please upload documents first.";
  }

  const readyDocs = docs.filter((d) => d.status === "ready");
  if (readyDocs.length === 0) {
    return "Documents are still being processed. Please try again in a moment.";
  }

  // Get chunks for all ready documents
  const allChunks: string[] = [];
  for (const doc of readyDocs) {
    const chunks = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.documentId, doc.id));

    chunks.forEach((c) => allChunks.push(`[${doc.filename}] ${c.content}`));
  }

  // Use Claude to find relevant chunks and answer (simple RAG without vector search)
  const context = allChunks.slice(0, 20).join("\n\n---\n\n"); // Limit context

  const answer = await chat(
    `You are a document analysis assistant. Answer the user's question based ONLY on the provided document excerpts. If the answer is not in the documents, say so clearly. Always cite which document the information came from.`,
    [
      {
        role: "user",
        content: `Document excerpts:\n\n${context}\n\n---\n\nQuestion: ${question}`,
      },
    ]
  );

  return answer;
}
