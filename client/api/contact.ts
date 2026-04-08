import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;
const requestStore = new Map<string, { count: number; startedAt: number }>();

const cleanStore = () => {
  const now = Date.now();
  for (const [key, value] of requestStore.entries()) {
    if (now - value.startedAt > RATE_LIMIT_WINDOW_MS) {
      requestStore.delete(key);
    }
  }
};

const getClientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  cleanStore();
  const ip = getClientIp(req);
  const bucket = requestStore.get(ip);
  if (bucket && Date.now() - bucket.startedAt < RATE_LIMIT_WINDOW_MS && bucket.count >= RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again in a minute." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim();
  const company = String(payload?.company || "").trim();
  const message = String(payload?.message || "").trim();
  const website = String(payload?.website || "").trim();

  if (website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 20 || message.length > 4000) {
    return new Response(JSON.stringify({ error: "Validation failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server configuration is missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase.from("messages").insert([
    {
      name,
      email,
      company,
      message,
      source: String(payload?.source || "website"),
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to store message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  requestStore.set(ip, bucket ? { count: bucket.count + 1, startedAt: bucket.startedAt } : { count: 1, startedAt: Date.now() });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
