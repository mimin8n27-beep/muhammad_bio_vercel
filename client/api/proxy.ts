export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const envHosts = (process.env.N8N_PREVIEW_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  const allowedDomains = [
    "n8n.cloud",
    "n8n.io",
    "app.n8n.cloud",
    ...envHosts,
  ];
  const hostname = parsed.hostname.toLowerCase();
  const isAllowed = allowedDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
  if (!isAllowed) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const requestHeaders = new Headers();
    requestHeaders.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    );
    requestHeaders.set(
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    );

    const response = await fetch(parsed.toString(), {
      headers: {
        ...Object.fromEntries(requestHeaders.entries()),
      },
    });

    const body = await response.text();
    const headers = new Headers(response.headers);
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");
    headers.delete("content-length");
    headers.set("Access-Control-Allow-Origin", url.origin);
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'self'; default-src * data: blob: 'unsafe-inline' 'unsafe-eval';",
    );

    return new Response(body, { status: response.status, headers });
  } catch (err: any) {
    return new Response("Proxy error: " + err.message, { status: 500 });
  }
}
