import { useEffect, useState } from "react";
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
                  onClick={() => { setPreviewProject(selected); setSelected(null); setZoom(1); setOffset({ x: 0, y: 0 }); }}
                  className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" /> عرض المشروع
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Protected Image Preview Modal ===== */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col select-none" dir="ltr">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#111] border-b border-white/10 flex-shrink-0" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold text-sm">{previewProject.title}</span>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                🔒 معاينة محمية — للعرض فقط
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white/60 text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button onClick={() => setPreviewProject(null)}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="flex-1 overflow-hidden relative bg-[#0d0d0d] cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => { setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); }}
            onMouseMove={(e) => { if (dragging) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onWheel={(e) => { e.preventDefault(); setZoom(z => Math.min(4, Math.max(0.5, z - e.deltaY * 0.001))); }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Transparent overlay — blocks right-click save */}
            <div className="absolute inset-0 z-10" onContextMenu={(e) => e.preventDefault()} />

            {previewProject.image_url ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                  transformOrigin: "center",
                  transition: dragging ? "none" : "transform 0.1s ease",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                <img
                  src={previewProject.image_url}
                  alt={previewProject.title}
                  draggable={false}
                  style={{ maxWidth: "80vw", maxHeight: "75vh", borderRadius: "12px", boxShadow: "0 25px 60px rgba(0,0,0,0.7)", display: "block", userSelect: "none", WebkitUserDrag: "none" } as any}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/30 text-center">
                <div>
                  <div className="text-5xl mb-3">🖼️</div>
                  <p>لا توجد صورة لهذا المشروع</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="px-5 py-2.5 bg-[#111] border-t border-white/10 flex items-center justify-between flex-shrink-0" dir="rtl">
            <p className="text-white/30 text-xs">🖱️ اسحب للتحريك &nbsp;|&nbsp; Scroll للزوم</p>
            <p className="text-white/30 text-xs">هذا المشروع محمي — للعرض فقط</p>
          </div>
        </div>
      )}
    </div>
  );
}
