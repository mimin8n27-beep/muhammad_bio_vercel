export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  const allowedDomains = ["n8n.cloud", "n8n.io", "app.n8n.cloud"];
  const isAllowed = allowedDomains.some((d) => target.includes(d));
  if (!isAllowed) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const body = await response.text();
    const headers = new Headers(response.headers);
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(body, { status: response.status, headers });
  } catch (err: any) {
    return new Response("Proxy error: " + err.message, { status: 500 });
  }
}
