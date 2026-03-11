import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import SharedHeader from "@/components/SharedHeader";
import { ArrowLeft, X, Maximize2 } from "lucide-react";

const WHATSAPP_NUMBER = "+201064998737";

function renderMarkdown(rawText: string): string {
  const lines = rawText.split("\n");
  const escaped = lines.map(line =>
    line.trimStart().startsWith("|") ? line
      : line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  ).join("\n");

  const tableRegex = /((?:^\|.+\|\n?)+)/gm;
  const withTables = escaped.replace(tableRegex, (tableBlock) => {
    const rows = tableBlock.trim().split("\n").filter(r => r.trim());
    if (rows.length < 2) return tableBlock;
    let html = '<div style="overflow-x:auto;margin:12px 0"><table style="width:100%;border-collapse:collapse;font-size:13px">';
    let headerDone = false;
    rows.forEach((row) => {
      if (/^\|[-| :]+\|$/.test(row.trim())) { headerDone = true; return; }
      const cells = row.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isHeader = !headerDone;
      const tag = isHeader ? "th" : "td";
      const style = isHeader
        ? 'style="padding:8px 12px;background:#f1f5f9;font-weight:700;border:1px solid #e2e8f0;text-align:left"'
        : 'style="padding:7px 12px;border:1px solid #e2e8f0;vertical-align:top"';
      html += `<tr>${cells.map(c => `<${tag} ${style}>${c.trim()}</${tag}>`).join("")}</tr>`;
      if (isHeader) headerDone = true;
    });
    html += "</table></div>";
    return html;
  });

  return withTables
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:700;color:#1e293b;margin:14px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:700;color:#1e293b;margin:16px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:18px;font-weight:800;color:#1e293b;margin:18px 0 10px">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li style="margin:3px 0 3px 18px;list-style:disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:3px 0 3px 18px;list-style:decimal">$2</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="margin:8px 0">${m}</ul>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^---$/gm, '')
    .replace(/^#{1,3} /gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^- /gm, '')
    .replace(/^\d+\. /gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function MarkdownText({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={className}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
      style={{ lineHeight: 1.7, textAlign: "start" }}
    />
  );
}

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
  created_at: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, client_name, tools, status, link_url, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
      const params = new URLSearchParams(window.location.search);
      const openId = params.get("open");
      if (openId) {
        const target = data.find((p: Project) => p.id === openId);
        if (target) {
          const { data: svgData } = await supabase
            .from("projects").select("svg_url").eq("id", openId).single();
          if (svgData?.svg_url) {
            setPreviewProject({ ...target, svg_url: svgData.svg_url });
            window.history.replaceState({}, "", "/portfolio");
          }
        }
      }
    }
    setLoading(false);
  };

  const openModal = async (project: Project) => {
    if (project.image_url !== undefined) {
      setSelected(project);
      return;
    }
    const { data } = await supabase
      .from("projects").select("image_url").eq("id", project.id).single();
    const full: Project = { ...project, image_url: data?.image_url || "" };
    setProjects(ps => ps.map(p => p.id === project.id ? full : p));
    setSelected(full);
  };

  const openPreview = async (project: Project) => {
    if (project.svg_url !== undefined) {
      setPreviewProject(project);
      return;
    }
    const { data } = await supabase
      .from("projects").select("svg_url").eq("id", project.id).single();
    const full: Project = { ...project, svg_url: data?.svg_url || "" };
    setProjects(ps => ps.map(p => p.id === project.id ? full : p));
    setPreviewProject(full);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-white text-foreground" dir="rtl">

      <SharedHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-lg">
            <span className="text-sm font-semibold text-primary">مشاريعي</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">معرض الأعمال</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">مشاريع حقيقية بنيتها باستخدام تقنيات الأتمتة الحديثة</p>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">لا توجد مشاريع حالياً</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openModal(project)}
                  className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">⚡</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground text-lg mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {stripMarkdown(project.description)}
                      </p>
                    )}
                    {project.tools && (
                      <div className="flex flex-wrap gap-1.5">
                        {toolsList(project.tools).slice(0, 3).map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 rounded-md text-primary text-xs font-medium">{tool}</span>
                        ))}
                        {toolsList(project.tools).length > 3 && (
                          <span className="px-2 py-1 bg-secondary rounded-md text-muted-foreground text-xs">
                            +{toolsList(project.tools).length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">هل يعجبك عملي؟</h2>
          <p className="text-white/80 mb-8 text-lg">تواصل معي وابدأ مشروعك الآن</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-white/90 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            ابدأ مشروعك الآن
          </a>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© 2026 محمد - متخصص في أتمتة الأعمال الرقمية</p>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </a>
        </div>
      </footer>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto flex-1">
              {selected.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6" dir="rtl">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground leading-tight flex-1 ml-4">{selected.title}</h2>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                {selected.client_name && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>👤</span>
                    <span>المؤلف: <span className="text-foreground font-medium">{selected.client_name}</span></span>
                  </div>
                )}
                {selected.description && (
                  <MarkdownText text={selected.description} className="text-muted-foreground text-sm mb-6" />
                )}
                {selected.tools && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-3 font-semibold">الأدوات المستخدمة</p>
                    <div className="flex flex-wrap gap-2">
                      {toolsList(selected.tools).map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-sm font-medium">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-white rounded-b-2xl flex-shrink-0" dir="rtl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const proj = selected;
                  setSelected(null);
                  openPreview(proj);
                }}
                className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" /> عرض المشروع
              </button>
            </div>
          </div>
        </div>
      )}

      {previewProject && (
        <SVGViewer
          svgUrl={previewProject.svg_url || ""}
          projectTitle={previewProject.title}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </div>
  );
}

function SVGViewer({
  svgUrl,
  projectTitle,
  onClose,
}: {
  svgUrl: string;
  projectTitle: string;
  onClose: () => void;
}) {
  const isHTML =
    svgUrl.startsWith("data:text/html") ||
    svgUrl.includes("<!DOCTYPE") ||
    svgUrl.includes("<html");

  const closeBtnStyle: React.CSSProperties = {
    background: "rgba(239,68,68,0.2)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8,
    padding: "0 14px",
    height: 32,
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", background: "#0f172a" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0066ff,#0044aa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: 14 }}>M</div>
          <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{projectTitle}</span>
          <span style={{ padding: "2px 10px", borderRadius: 20, background: "rgba(234,179,8,0.15)", color: "#fbbf24", fontSize: 11, border: "1px solid rgba(234,179,8,0.3)" }}>🔒 للعرض فقط</span>
        </div>
        <button onClick={onClose} style={closeBtnStyle}>
          <span>✕</span><span>إغلاق</span>
        </button>
      </div>

      {isHTML ? (
        <iframe
          src={svgUrl}
          style={{ flex: 1, border: "none", width: "100%", background: "#1c1c28" }}
          title={projectTitle}
          sandbox="allow-scripts"
        />
      ) : svgUrl ? (
        <SVGImageViewer svgUrl={svgUrl} projectTitle={projectTitle} />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          لا يوجد محتوى للعرض
        </div>
      )}
    </div>
  );
}

function SVGImageViewer({ svgUrl, projectTitle }: { svgUrl: string; projectTitle: string }) {
  const [zoom, setZoom] = useState(0.7);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(5, Math.max(0.1, z - e.deltaY * 0.001)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflow: "hidden", position: "relative", cursor: dragging ? "grabbing" : "grab", background: "#1c1c28" }}
      onMouseDown={(e) => { setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); }}
      onMouseMove={(e) => { if (dragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
        transformOrigin: "center",
        transition: dragging ? "none" : "transform 0.05s ease",
      }}>
        <img src={svgUrl} alt={projectTitle} style={{ display: "block", maxWidth: "none" }} draggable={false} />
      </div>
    </div>
  );
}
