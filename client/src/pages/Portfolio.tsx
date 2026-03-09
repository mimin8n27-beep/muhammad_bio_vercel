import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, X, Github, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

const WHATSAPP_NUMBER = "+201064998737";
const GITHUB_URL = "https://github.com/mimin8n27-beep";

interface Project {
  id: string;
  title: string;
  description: string;
  client_name: string;
  tools: string;
  status: string;
  image_url: string;
  link_url: string;
  created_at: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects").select("*").eq("status", "active")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-white text-foreground" dir="rtl">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Muhammad</h1>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">الرئيسية</a>
            <span className="text-sm text-primary font-semibold">معرض الأعمال</span>
          </nav>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all">
            <Github className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold text-foreground">GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
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

      {/* Projects Grid */}
      <section className="py-20 border-t border-border">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32 text-muted-foreground">
              <p className="text-2xl mb-2">لا توجد مشاريع بعد</p>
              <p className="text-sm">سيتم إضافة المشاريع قريباً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={project.id} onClick={() => setSelected(project)}
                  className="group cursor-pointer bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fadeInUp"
                  style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center"><div className="text-4xl mb-2">⚙️</div><p className="text-xs">لا توجد صورة</p></div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                    )}
                    {project.tools && (
                      <div className="flex flex-wrap gap-2">
                        {toolsList(project.tools).slice(0, 4).map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 rounded-md text-primary text-xs font-medium">{tool}</span>
                        ))}
                        {toolsList(project.tools).length > 4 && (
                          <span className="px-2 py-1 bg-secondary rounded-md text-muted-foreground text-xs">+{toolsList(project.tools).length - 4}</span>
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">هل يعجبك عملي؟</h2>
          <p className="text-white/80 mb-8 text-lg">تواصل معي وابدأ مشروعك الآن</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-white/90 transition-all hover:shadow-xl hover:-translate-y-0.5">
            ابدأ مشروعك الآن
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© 2026 محمد - متخصص في أتمتة الأعمال الرقمية</p>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
          </a>
        </div>
      </footer>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
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
                  <span>العميل: <span className="text-foreground font-medium">{selected.client_name}</span></span>
                </div>
              )}
              {selected.description && <p className="text-muted-foreground leading-relaxed mb-6">{selected.description}</p>}
              {selected.tools && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">الأدوات المستخدمة</p>
                  <div className="flex flex-wrap gap-2">
                    {toolsList(selected.tools).map((tool, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-sm font-medium">{tool}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.link_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const proj = selected;
                    setSelected(null);
                    setZoom(0.7);
                    setOffset({ x: 0, y: 0 });
                    setPreviewProject(proj);
                  }}
                  className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" /> عرض المشروع
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Workflow Viewer ===== */}
      {previewProject && (
        <WorkflowViewer
          projectTitle={previewProject.title}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// WORKFLOW DATA
// ============================================================
const WORKFLOW_NODES = [
  { id: "64fe44db", name: "Listen for incoming events", type: "telegramTrigger", position: [1168, 496], icon: "📨", color: "#0088cc", label: "Telegram Trigger" },
  { id: "c639feb1", name: "AllowList", type: "set", position: [1392, 496], icon: "✏️", color: "#FF6B6B", label: "Set" },
  { id: "93e1d858", name: "If1", type: "if", position: [1616, 496], icon: "⚡", color: "#9B59B6", label: "IF" },
  { id: "b67a2a93", name: "Voice or Text", type: "set", position: [1840, 496], icon: "✏️", color: "#FF6B6B", label: "Set" },
  { id: "e791d4f8", name: "If", type: "if", position: [2064, 496], icon: "⚡", color: "#9B59B6", label: "IF" },
  { id: "8105c39f", name: "Get Voice File", type: "telegram", position: [2288, 416], icon: "📁", color: "#0088cc", label: "Telegram" },
  { id: "5bd1788a", name: "Speech to Text", type: "openai", position: [2512, 416], icon: "🎙️", color: "#10A37F", label: "OpenAI" },
  { id: "759b975f", name: "Angie, AI Assistant", type: "agent", position: [2992, 496], icon: "🤖", color: "#FF9500", label: "AI Agent" },
  { id: "e35c04ff", name: "Telegram", type: "telegram", position: [3584, 496], icon: "📤", color: "#0088cc", label: "Telegram" },
  { id: "46511f47", name: "OpenAI Chat Model", type: "lmChatOpenAi", position: [2736, 720], icon: "🧠", color: "#10A37F", label: "OpenAI Model" },
  { id: "d2287bea", name: "Window Buffer Memory", type: "memoryBufferWindow", position: [2864, 720], icon: "💾", color: "#3498DB", label: "Memory" },
  { id: "40e92679", name: "Tasks", type: "baserowTool", position: [2992, 720], icon: "✅", color: "#E67E22", label: "Baserow" },
  { id: "570a0647", name: "Contacts", type: "baserowTool", position: [3120, 720], icon: "👥", color: "#E67E22", label: "Baserow" },
  { id: "fa955731", name: "Get Email", type: "gmailTool", position: [3248, 720], icon: "📧", color: "#EA4335", label: "Gmail" },
  { id: "c70236ea", name: "Google Calendar", type: "googleCalendarTool", position: [3376, 720], icon: "📅", color: "#4285F4", label: "Calendar" },
];

const WORKFLOW_STICKIES = [
  { id: "s1", content: "Overview", body: "Meet Angie - your personal AI assistant that handles voice & text via Telegram.", position: [368, 352], width: 720, height: 400, color: "#1e3a5f" },
  { id: "s2", content: "Security: only allow authorized IDs", body: "Please add the ids into the setting node that you want to authorize", position: [1328, 336], width: 448, height: 327, color: "#1e3a5f" },
  { id: "s3", content: "Process Telegram Request", body: "", position: [1824, 336], width: 800, height: 327, color: "#1e3a5f" },
];

const WORKFLOW_CONNECTIONS = [
  { from: "64fe44db", to: "c639feb1" },
  { from: "c639feb1", to: "93e1d858" },
  { from: "93e1d858", to: "b67a2a93" },
  { from: "b67a2a93", to: "e791d4f8" },
  { from: "e791d4f8", to: "8105c39f" },
  { from: "e791d4f8", to: "759b975f" },
  { from: "8105c39f", to: "5bd1788a" },
  { from: "5bd1788a", to: "759b975f" },
  { from: "759b975f", to: "e35c04ff" },
  { from: "46511f47", to: "759b975f", type: "ai" },
  { from: "d2287bea", to: "759b975f", type: "ai" },
  { from: "40e92679", to: "759b975f", type: "ai" },
  { from: "570a0647", to: "759b975f", type: "ai" },
  { from: "fa955731", to: "759b975f", type: "ai" },
  { from: "c70236ea", to: "759b975f", type: "ai" },
];

const NODE_W = 140;
const NODE_H = 60;

function WFConnection({ nodes, conn }: { nodes: any[], conn: any }) {
  const nodeMap = Object.fromEntries(nodes.map((n: any) => [n.id, n]));
  const from = nodeMap[conn.from];
  const to = nodeMap[conn.to];
  if (!from || !to) return null;
  const isAI = conn.type === "ai";
  const fx = from.position[0] + NODE_W;
  const fy = from.position[1] + NODE_H / 2;
  const tx = to.position[0];
  const ty = to.position[1] + NODE_H / 2;
  const mx = (fx + tx) / 2;
  const color = isAI ? "#FF9500" : "#cbd5e1";
  const d = `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={isAI ? 1.5 : 2}
        strokeDasharray={isAI ? "4 3" : "none"} opacity={0.7} />
      <polygon points={`${tx},${ty} ${tx - 8},${ty - 4} ${tx - 8},${ty + 4}`} fill={color} opacity={0.8} />
    </g>
  );
}

function WFNode({ node, selected, onClick }: { node: any, selected: boolean, onClick: (n: any) => void }) {
  return (
    <g transform={`translate(${node.position[0]}, ${node.position[1]})`} onClick={() => onClick(node)} style={{ cursor: "pointer" }}>
      <rect x={3} y={3} width={NODE_W} height={NODE_H} rx={8} fill="rgba(0,0,0,0.3)" />
      <rect width={NODE_W} height={NODE_H} rx={8}
        fill={selected ? "#1e293b" : "#0f172a"}
        stroke={selected ? node.color : (node.type === "agent" ? node.color : "#334155")}
        strokeWidth={selected ? 2.5 : (node.type === "agent" ? 2 : 1.5)} />
      <rect width={NODE_W} height={4} rx={4} fill={node.color} opacity={0.9} />
      <circle cx={22} cy={NODE_H / 2 + 2} r={12} fill={node.color} opacity={0.2} />
      <text x={22} y={NODE_H / 2 + 7} textAnchor="middle" fontSize={14}>{node.icon}</text>
      <text x={40} y={NODE_H / 2 - 4} fill="#e2e8f0" fontSize={9} fontWeight="600" fontFamily="monospace">
        {node.name.length > 16 ? node.name.slice(0, 16) + "…" : node.name}
      </text>
      <text x={40} y={NODE_H / 2 + 8} fill="#64748b" fontSize={8}>{node.label}</text>
      {node.type === "telegramTrigger" && (
        <g>
          <rect x={NODE_W - 28} y={4} width={24} height={12} rx={3} fill="#22c55e" opacity={0.9} />
          <text x={NODE_W - 16} y={13} textAnchor="middle" fill="white" fontSize={7} fontWeight="bold">ON</text>
        </g>
      )}
    </g>
  );
}

function WorkflowViewer({ onClose, projectTitle }: { onClose: () => void, projectTitle: string }) {
  const [zoom, setZoom] = useState(0.55);
  const [offset, setOffset] = useState({ x: -200, y: -80 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(3, Math.max(0.2, z - e.deltaY * 0.001)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [handleWheel]);

  const btnS: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", cursor: "pointer", fontSize: 14,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      background: "radial-gradient(ellipse at 30% 20%, #1e293b 0%, #0f172a 100%)",
      userSelect: "none"
    }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0066ff,#0044aa)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: 14 }}>M</div>
          <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{projectTitle}</span>
          <span style={{ padding: "2px 10px", borderRadius: 20, background: "rgba(234,179,8,0.15)", color: "#fbbf24", fontSize: 11, border: "1px solid rgba(234,179,8,0.3)" }}>🔒 للعرض فقط</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.15))} style={btnS}>＋</button>
          <span style={{ color: "#64748b", fontSize: 12, minWidth: 44, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.15))} style={btnS}>－</button>
          <button onClick={() => { setZoom(0.55); setOffset({ x: -200, y: -80 }); }} style={btnS}>↺</button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          <button onClick={onClose} style={{ ...btnS, background: "rgba(239,68,68,0.2)", color: "#f87171" }}>✕</button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef}
        style={{ flex: 1, overflow: "hidden", position: "relative", cursor: dragging ? "grabbing" : "grab", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        onMouseDown={(e) => { setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); }}
        onMouseMove={(e) => { if (dragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onClick={(e) => { if ((e.target as HTMLElement).tagName === "svg") setSelectedNode(null); }}
      >
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "0 0", transition: dragging ? "none" : "transform 0.05s ease" }}
          viewBox="200 200 3600 800"
        >
          {WORKFLOW_STICKIES.map(s => (
            <g key={s.id} transform={`translate(${s.position[0]}, ${s.position[1]})`}>
              <rect width={s.width} height={s.height} rx={6} fill={s.color} opacity={0.5} stroke="#334155" strokeWidth={1} />
              <text x={16} y={28} fill="#93c5fd" fontSize={11} fontWeight="700">{s.content}</text>
              {s.body && <text x={16} y={48} fill="#94a3b8" fontSize={9}>{s.body.slice(0, 60)}</text>}
            </g>
          ))}
          {WORKFLOW_CONNECTIONS.map((conn, i) => (
            <WFConnection key={i} nodes={WORKFLOW_NODES} conn={conn} />
          ))}
          {WORKFLOW_NODES.map(node => (
            <WFNode key={node.id} node={node} selected={selectedNode?.id === node.id} onClick={setSelectedNode} />
          ))}
        </svg>

        {selectedNode && (
          <div style={{ position: "absolute", bottom: 60, right: 20, background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 20px", minWidth: 220, backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{selectedNode.icon}</span>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{selectedNode.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{selectedNode.label}</div>
              </div>
            </div>
            <div style={{ height: 2, borderRadius: 1, background: `linear-gradient(to right, ${selectedNode.color}, transparent)` }} />
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{ padding: "8px 20px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>🖱️ اسحب للتحريك | Scroll للزوم | اضغط على node للتفاصيل</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>{WORKFLOW_NODES.length} nodes · محمي للعرض فقط</span>
      </div>
    </div>
  );
}
