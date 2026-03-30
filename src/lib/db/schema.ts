import { pgTable, text, timestamp, uuid, jsonb, integer, boolean, serial, index } from "drizzle-orm/pg-core";

// ============== TENANTS ==============
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["shopify", "legal", "agency"] }).notNull(),
  config: jsonb("config").$type<TenantConfig>().default({}),
  systemPrompt: text("system_prompt").notNull(),
  widgetConfig: jsonb("widget_config").$type<WidgetConfig>().default({}),
  contactEmail: text("contact_email"),
  slackWebhookUrl: text("slack_webhook_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============== CONVERSATIONS ==============
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  sessionId: text("session_id").notNull(),
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  status: text("status", { enum: ["active", "escalated", "closed"] }).default("active").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("conv_tenant_idx").on(table.tenantId),
  index("conv_session_idx").on(table.sessionId),
]);

// ============== MESSAGES ==============
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("msg_conv_idx").on(table.conversationId),
]);

// ============== DOCUMENTS (Legal) ==============
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  filename: text("filename").notNull(),
  fileUrl: text("file_url"),
  contentText: text("content_text"),
  status: text("status", { enum: ["processing", "ready", "error"] }).default("processing").notNull(),
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("doc_tenant_idx").on(table.tenantId),
]);

// ============== DOCUMENT CHUNKS (RAG) ==============
export const documentChunks = pgTable("document_chunks", {
  id: serial("id").primaryKey(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  content: text("content").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("chunk_doc_idx").on(table.documentId),
]);

// ============== LEADS ==============
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  needs: text("needs"),
  score: integer("score").default(0),
  status: text("status", { enum: ["new", "qualified", "contacted", "closed"] }).default("new").notNull(),
  conversationId: uuid("conversation_id").references(() => conversations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("lead_tenant_idx").on(table.tenantId),
]);

// ============== KNOWLEDGE BASE ==============
export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
  content: text("content").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("kb_tenant_idx").on(table.tenantId),
]);

// ============== TYPES ==============
export type TenantConfig = {
  shopifyDomain?: string;
  shopifyAccessToken?: string;
  maxMessagesPerConversation?: number;
  escalationThreshold?: number;
  [key: string]: unknown;
};

export type WidgetConfig = {
  primaryColor?: string;
  greeting?: string;
  logo?: string;
  position?: "bottom-right" | "bottom-left";
  [key: string]: unknown;
};
