export const PROJECT_VIEWER_MODES = [
  "live_n8n",
  "image_only",
  "svg_only",
  "none",
] as const;

export type ProjectViewerMode = (typeof PROJECT_VIEWER_MODES)[number];

export const DEFAULT_PROJECT_VIEWER_MODE: ProjectViewerMode = "none";

export const DEFAULT_ALLOWED_N8N_HOSTS = [
  "n8n.cloud",
  "n8n.io",
  "app.n8n.cloud",
  "localhost",
  "127.0.0.1",
];

export function getAllowedN8nHosts(extraHosts?: string | null) {
  const extra = (extraHosts || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ALLOWED_N8N_HOSTS, ...extra]));
}

export function isAllowedN8nPreviewUrl(
  value: string,
  extraHosts?: string | null,
) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return false;

    const hostname = url.hostname.toLowerCase();
    return getAllowedN8nHosts(extraHosts).some(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function getProxyPreviewUrl(targetUrl: string) {
  const url = new URL("/api/proxy", window.location.origin);
  url.searchParams.set("url", targetUrl);
  return url.toString();
}
