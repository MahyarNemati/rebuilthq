import { z } from "zod";

const OrderLookupSchema = z.object({
  email: z.string().email(),
  orderNumber: z.string().min(1),
});

type ShopifyProduct = {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  variants: { price: string; title: string; available: boolean }[];
  images: { src: string }[];
};

type ShopifyOrder = {
  id: number;
  name: string;
  email: string;
  financial_status: string;
  fulfillment_status: string | null;
  created_at: string;
  total_price: string;
  currency: string;
  line_items: { title: string; quantity: number; price: string }[];
  shipping_address?: { city: string; province: string; country: string };
  fulfillments: { tracking_number: string; tracking_url: string; status: string }[];
};

async function shopifyFetch<T>(endpoint: string, domain?: string, token?: string): Promise<T> {
  const storeDomain = domain || process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = token || process.env.SHOPIFY_ACCESS_TOKEN;

  if (!storeDomain || !accessToken) {
    throw new Error("Shopify credentials not configured");
  }

  const res = await fetch(`https://${storeDomain}/admin/api/2024-01/${endpoint}`, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(domain?: string, token?: string): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: ShopifyProduct[] }>(
    "products.json?limit=250&status=active",
    domain,
    token
  );
  return data.products;
}

export async function lookupOrder(email: string, orderNumber: string, domain?: string, token?: string) {
  const parsed = OrderLookupSchema.parse({ email, orderNumber });

  const cleanOrderNumber = parsed.orderNumber.replace("#", "");
  const data = await shopifyFetch<{ orders: ShopifyOrder[] }>(
    `orders.json?name=${encodeURIComponent(cleanOrderNumber)}&email=${encodeURIComponent(parsed.email)}&status=any`,
    domain,
    token
  );

  if (data.orders.length === 0) {
    return null;
  }

  const order = data.orders[0];
  return {
    orderNumber: order.name,
    status: order.fulfillment_status || "unfulfilled",
    financialStatus: order.financial_status,
    total: `${order.total_price} ${order.currency}`,
    items: order.line_items.map((item) => `${item.title} x${item.quantity}`),
    tracking: order.fulfillments.length > 0
      ? {
          number: order.fulfillments[0].tracking_number,
          url: order.fulfillments[0].tracking_url,
          status: order.fulfillments[0].status,
        }
      : null,
    shippingTo: order.shipping_address
      ? `${order.shipping_address.city}, ${order.shipping_address.province}, ${order.shipping_address.country}`
      : null,
    createdAt: order.created_at,
  };
}

export function formatProductsForContext(products: ShopifyProduct[]): string {
  return products
    .map(
      (p) =>
        `**${p.title}** — $${p.variants[0]?.price || "N/A"}\n${p.body_html?.replace(/<[^>]*>/g, "").slice(0, 200) || "No description"}`
    )
    .join("\n\n");
}
