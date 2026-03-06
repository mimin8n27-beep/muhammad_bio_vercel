import type { VercelRequest, VercelResponse } from "@vercel/node";
import https from "https";
import http from "http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Only allow n8n URLs for security
  const allowedDomains = ["n8n.cloud", "n8n.io", "app.n8n.cloud"];
  const isAllowed = allowedDomains.some((d) => url.includes(d));
  if (!isAllowed) {
    return res.status(403).json({ error: "Domain not allowed" });
  }

  try {
    const targetUrl = new URL(url);
    const protocol = targetUrl.protocol === "https:" ? https : http;

    const proxyReq = protocol.get(
      {
        hostname: targetUrl.hostname,
        path: targetUrl.pathname + targetUrl.search,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      },
      (proxyRes) => {
        // Remove headers that block iframe embedding
        const headers = { ...proxyRes.headers };
        delete headers["x-frame-options"];
        delete headers["content-security-policy"];
        delete headers["x-content-type-options"];

        // Set headers to allow iframe
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("X-Frame-Options", "ALLOWALL");
        res.writeHead(proxyRes.statusCode || 200, headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", (err) => {
      res.status(500).json({ error: "Proxy error: " + err.message });
    });

    proxyReq.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
