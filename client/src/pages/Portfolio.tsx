import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ExternalLink, Loader2, X } from "lucide-react";
import { Link } from "wouter";

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0066ff] rounded-lg flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-bold text-lg">معرض الأعمال</span>
          </div>
          <Link href="/">
            <a className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </a>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0066ff] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1.5 bg-[#0066ff]/20 border border-[#0066ff]/30 rounded-full text-[#0066ff] text-sm font-semibold">
            مشاريعي
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            أعمالي في الأتمتة
          </h1>
          <p className="text-white/60 text-lg">
            مشاريع حقيقية بنيتها باستخدام تقنيات الأتمتة الحديثة
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#0066ff]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 text-white/40">
            <p className="text-2xl mb-2">لا توجد مشاريع بعد</p>
            <p className="text-sm">سيتم إضافة المشاريع قريباً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelected(project)}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#0066ff]/50 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0066ff]/10"
              >
                {/* Image */}
                <div className="aspect-video bg-white/5 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <div className="text-center">
                        <div className="text-4xl mb-2">⚙️</div>
                        <p className="text-xs">لا توجد صورة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#0066ff] transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-white/50 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Tools */}
                  {project.tools && (
                    <div className="flex flex-wrap gap-2">
                      {toolsList(project.tools).slice(0, 4).map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#0066ff]/15 border border-[#0066ff]/20 rounded-md text-[#0066ff] text-xs font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                      {toolsList(project.tools).length > 4 && (
                        <span className="px-2 py-1 bg-white/5 rounded-md text-white/40 text-xs">
                          +{toolsList(project.tools).length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#111] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            {selected.image_url && (
              <div className="aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold leading-tight flex-1 ml-4">
                  {selected.title}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selected.client_name && (
                <div className="mb-4 flex items-center gap-2 text-sm text-white/50">
                  <span>👤</span>
                  <span>العميل: <span className="text-white/80">{selected.client_name}</span></span>
                </div>
              )}

              {selected.description && (
                <p className="text-white/70 leading-relaxed mb-6">
                  {selected.description}
                </p>
              )}

              {/* Tools */}
              {selected.tools && (
                <div className="mb-6">
                  <p className="text-sm text-white/40 mb-3 font-semibold uppercase tracking-wider">
                    الأدوات المستخدمة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {toolsList(selected.tools).map((tool, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-[#0066ff]/15 border border-[#0066ff]/25 rounded-lg text-[#0066ff] text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External Link */}
              {selected.link_url && (
                <a
                  href={selected.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center py-3 bg-[#0066ff] hover:bg-[#0055ee] rounded-xl font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  عرض المشروع
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
