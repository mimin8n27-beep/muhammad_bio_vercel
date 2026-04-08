import { useEffect, useMemo, useState } from "react";

import SharedHeaderPremiumEn from "@/components/SharedHeaderPremiumEn";
import { MotionReveal } from "@/components/site/MotionReveal";
import { SiteFooterEn } from "@/components/site/SiteFooterEn";
import { stripMarkdown } from "@/components/site/SafeRichText";
import {
  DEFAULT_PROJECT_VIEWER_MODE,
  getProxyPreviewUrl,
  type ProjectViewerMode,
} from "@/lib/portfolioViewer";
import { supabase } from "@/lib/supabase";
import {
  ArrowUpRight,
  ExternalLink,
  Lock,
  Maximize2,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "+201064998737";

interface Project {
  id: string;
  title: string;
  description: string;
  client_name: string;
  tools: string;
  status: string;
  image_url?: string;
  svg_url?: string;
  link_url?: string;
  viewer_mode?: ProjectViewerMode;
  created_at: string;
}

function inferViewerMode(project: Partial<Project>): ProjectViewerMode {
  if (project.viewer_mode) return project.viewer_mode;
  if (project.link_url) return "live_n8n";
  if (project.svg_url) return "svg_only";
  if (project.image_url) return "image_only";
  return DEFAULT_PROJECT_VIEWER_MODE;
}

function toolsList(tools: string) {
  return tools ? tools.split(/[\s,]+/).map((tool) => tool.trim()).filter(Boolean) : [];
}

function hasDedicatedViewer(project: Project) {
  const mode = inferViewerMode(project);
  if (mode === "live_n8n") return Boolean(project.link_url);
  if (mode === "svg_only") return Boolean(project.svg_url);
  if (mode === "image_only") return Boolean(project.image_url);
  return false;
}

export default function PortfolioShowcasePremium() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    void fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);

    let { data, error } = await supabase
      .from("projects")
      .select("id, title, description, client_name, tools, status, image_url, svg_url, link_url, viewer_mode, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error && error.message?.includes("viewer_mode")) {
      ({ data, error } = await supabase
        .from("projects")
        .select("id, title, description, client_name, tools, status, image_url, svg_url, link_url, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false }));
    }

    if (!error && data) {
      const normalized = data.map((project: any) => ({
        ...project,
        viewer_mode: inferViewerMode(project),
      }));
      setProjects(normalized);

      const params = new URLSearchParams(window.location.search);
      const openId = params.get("open");
      if (openId) {
        const target = normalized.find((project: Project) => project.id === openId);
        if (target) {
          setPreviewProject(target);
        }
        window.history.replaceState({}, "", "/portfolio");
      }
    }

    setLoading(false);
  };

  const previewLabel = useMemo(() => {
    if (!selected) return "Open project";
    const mode = inferViewerMode(selected);
    if (mode === "live_n8n") return "Open live preview";
    if (mode === "svg_only") return "Open workflow map";
    if (mode === "image_only") return "Open preview";
    return "Open project";
  }, [selected]);

  return (
    <div className="page-shell dark min-h-screen text-foreground" dir="rtl">
      <SharedHeaderPremiumEn />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(4,12,24,0.9),rgba(7,18,34,0.95))] py-16 md:py-22">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#6dffd3] blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <MotionReveal variant="beam-sweep" intensity="high">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Automation showcase</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
              Automation portfolio
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              A selection of workflows, integrations, and automation builds designed to reduce manual work
              and create a cleaner operating layer.
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="surface-card overflow-hidden rounded-2xl p-4">
                  <div className="skeleton-block mb-4 aspect-video w-full" />
                  <div className="skeleton-block mb-3 h-6 w-3/4" />
                  <div className="skeleton-block h-4 w-full" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">No projects are published right now.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const mode = inferViewerMode(project);
                return (
                  <MotionReveal
                    key={project.id}
                    delay={index * 0.06}
                    variant="glow-pop"
                    intensity="high"
                  >
                    <div
                      onClick={() => setSelected(project)}
                      className="surface-card card-tilt group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                              <Workflow className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                        )}

                        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#06101f]/85 px-3 py-1.5 text-[11px] font-semibold text-white/88 backdrop-blur">
                          <Lock className="h-3.5 w-3.5 text-[#7bf1d3]" />
                          {mode === "live_n8n"
                            ? "Live preview"
                            : mode === "svg_only"
                              ? "Workflow map"
                              : mode === "image_only"
                                ? "Visual preview"
                                : "Case study"}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                            {project.title}
                          </h3>
                          {hasDedicatedViewer(project) ? (
                            <span className="pill-label whitespace-nowrap text-[10px]">View-only</span>
                          ) : null}
                        </div>

                        {project.description ? (
                          <p className="mb-4 line-clamp-3 text-sm leading-7 text-[#c8ddf0]">
                            {stripMarkdown(project.description)}
                          </p>
                        ) : null}

                        {project.tools ? (
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {toolsList(project.tools)
                              .slice(0, 4)
                              .map((tool, toolIndex) => (
                                <span
                                  key={toolIndex}
                                  className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-primary"
                                >
                                  {tool}
                                </span>
                              ))}
                          </div>
                        ) : null}

                        <div className="inline-flex items-center gap-2 text-sm text-[#c0d4ec]">
                          <Maximize2 className="h-4 w-4 text-primary" />
                          {hasDedicatedViewer(project) ? "Open preview" : "Open details"}
                        </div>
                      </div>
                    </div>
                  </MotionReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container text-center">
          <MotionReveal variant="dock-slide" intensity="high">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Need a similar automation setup for your business?</h2>
            <p className="mb-8 text-lg text-[#c8ddf0]">
              Let&apos;s build a workflow or integration designed around your operation and ready for daily use.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl"
            >
              Start your project
            </a>
          </MotionReveal>
        </div>
      </section>

      <SiteFooterEn
        homeHref="/"
        homeLabel="Back to home"
        note="This portfolio highlights automation systems, integrations, and workflow builds focused on operational clarity."
      />

      {selected ? (
        <ProjectDetailModal
          project={selected}
          previewLabel={previewLabel}
          onClose={() => setSelected(null)}
          onOpenPreview={() => {
            setPreviewProject(selected);
            setSelected(null);
          }}
        />
      ) : null}

      {previewProject ? (
        <ProjectShowcaseViewer
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      ) : null}
    </div>
  );
}

function ProjectDetailModal({
  project,
  previewLabel,
  onClose,
  onOpenPreview,
}: {
  project: Project;
  previewLabel: string;
  onClose: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="hud-panel flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overflow-y-auto flex-1">
          {project.image_url ? (
            <div className="aspect-video overflow-hidden rounded-t-2xl">
              <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="p-6" dir="rtl">
            <div className="mb-4 flex items-start justify-between">
              <div className="ml-4 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Lock className="h-3.5 w-3.5" />
                  Read-only showcase
                </div>
                <h2 className="text-2xl font-bold leading-tight text-foreground">{project.title}</h2>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-secondary">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {project.client_name ? (
              <div className="mb-4 text-sm text-muted-foreground">
                Client: <span className="font-medium text-foreground">{project.client_name}</span>
              </div>
            ) : null}

            {project.description ? (
              <p className="mb-6 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {stripMarkdown(project.description)}
              </p>
            ) : null}

            {project.tools ? (
              <div className="mb-2">
                <p className="mb-3 text-sm font-semibold text-muted-foreground">Tools used</p>
                <div className="flex flex-wrap gap-2">
                  {toolsList(project.tools).map((tool, index) => (
                    <span key={index} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border p-4" dir="rtl">
          {hasDedicatedViewer(project) ? (
            <button
              onClick={onOpenPreview}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <Maximize2 className="h-4 w-4" />
              {previewLabel}
            </button>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/60">
              This project does not currently include a dedicated preview window.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectShowcaseViewer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const mode = inferViewerMode(project);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#050d19]">
      <div className="showcase-frame-header px-4 py-3 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="showcase-brand-mark">M</div>
            <div>
              <p className="text-sm font-semibold text-white">{project.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/55">
                <span className="showcase-chip">
                  <Lock className="h-3.5 w-3.5" />
                  View only
                </span>
                <span className="showcase-chip">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#7bf1d3]" />
                  Secure preview
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.link_url ? (
              <a
                href={project.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-secondary-action"
              >
                <ExternalLink className="h-4 w-4" />
                Open in a new tab
              </a>
            ) : null}
            <button onClick={onClose} className="showcase-close-action">
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="showcase-body flex-1">
        {mode === "live_n8n" && project.link_url ? (
          <LiveN8nViewer project={project} />
        ) : mode === "svg_only" && project.svg_url ? (
          <div className="showcase-static-shell">
            <img src={project.svg_url} alt={project.title} className="max-h-full max-w-full object-contain" />
          </div>
        ) : mode === "image_only" && project.image_url ? (
          <div className="showcase-static-shell">
            <img src={project.image_url} alt={project.title} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="showcase-empty-state">
            <Workflow className="h-12 w-12 text-primary" />
            <p className="text-lg font-semibold text-white">No preview content is available yet</p>
            <p className="max-w-md text-center text-sm leading-7 text-white/55">
              Add a live preview link, SVG, or image from the admin panel to display this project in the viewer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LiveN8nViewer({ project }: { project: Project }) {
  const [source, setSource] = useState<"direct" | "proxy">("direct");
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setShowFallback(false);
    setSource("direct");
  }, [project.id, project.link_url]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (loaded) return;
      if (source === "direct") {
        setSource("proxy");
        return;
      }
      setShowFallback(true);
    }, source === "direct" ? 4500 : 6500);

    return () => window.clearTimeout(timeout);
  }, [loaded, source]);

  const src = source === "direct" ? project.link_url! : getProxyPreviewUrl(project.link_url!);

  return (
    <div className="showcase-live-shell">
      <div className="showcase-grid-glow" />

      {!loaded ? (
        <div className="showcase-loading-layer">
          <div className="showcase-loading-card">
            <div className="skeleton-block mb-4 h-4 w-24" />
            <div className="skeleton-block mb-3 h-8 w-48" />
            <div className="skeleton-block h-4 w-64" />
            <p className="mt-5 text-xs text-white/45">
              {source === "direct"
                ? "Loading live preview..."
                : "Switching to the secure preview proxy..."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="showcase-iframe-shell">
        <iframe
          key={`${project.id}-${source}`}
          src={src}
          title={`${project.title} preview`}
          className="h-full w-full border-0 bg-[#09111f]"
          sandbox="allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {showFallback ? (
        <div className="showcase-fallback-card">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            <Lock className="h-3.5 w-3.5" />
            Framing fallback
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            The live preview could not be opened inside the frame
          </h3>
          <p className="mb-5 text-sm leading-7 text-white/60">
            The link is still safe to view, but the source blocks full embedding. You can open it in a new tab
            or retry through the secure proxy route.
          </p>

          {project.image_url ? (
            <div className="mb-5 overflow-hidden rounded-2xl border border-white/10">
              <img src={project.image_url} alt={project.title} className="aspect-video w-full object-cover" />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowFallback(false);
                setLoaded(false);
                setSource("proxy");
              }}
              className="showcase-primary-action"
            >
              <ArrowUpRight className="h-4 w-4" />
              Retry through proxy
            </button>
            <a
              href={project.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-secondary-action"
            >
              <ExternalLink className="h-4 w-4" />
              Open in a new tab
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
