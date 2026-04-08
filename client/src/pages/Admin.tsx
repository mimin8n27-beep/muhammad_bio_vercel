import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_PROJECT_VIEWER_MODE,
  PROJECT_VIEWER_MODES,
  type ProjectViewerMode,
  isAllowedN8nPreviewUrl,
} from "@/lib/portfolioViewer";
import {
  LogOut, Plus, Trash2, Edit2, Save, X, Loader2,
  MessageSquare, Users, FolderOpen, Eye, EyeOff,
  Sun, Moon, ExternalLink, Upload, Gauge, ShieldCheck, Sparkles, Activity
} from "lucide-react";

// ===== تغيير الباسورد هنا =====
const ADMIN_PASSWORD = "muhammad2026";
// ==============================

type Tab = "projects" | "clients" | "messages";

interface Project {
  id?: string;
  title: string;
  description: string;
  client_name: string;
  tools: string;
  status: string;
  image_url: string;
  link_url: string;
  svg_url: string;
  viewer_mode: ProjectViewerMode;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  notes: string;
  plan: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

const emptyProject: Project = {
  title: "", description: "", client_name: "",
  tools: "", status: "active", image_url: "", link_url: "", svg_url: "",
  viewer_mode: DEFAULT_PROJECT_VIEWER_MODE,
};

function inferViewerMode(project: Partial<Project>): ProjectViewerMode {
  if (PROJECT_VIEWER_MODES.includes(project.viewer_mode as ProjectViewerMode)) {
    return project.viewer_mode as ProjectViewerMode;
  }
  if (project.link_url) return "live_n8n";
  if (project.svg_url) return "svg_only";
  if (project.image_url) return "image_only";
  return DEFAULT_PROJECT_VIEWER_MODE;
}

function getWorkflowAssetType(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.startsWith("data:text/html")) return "html";
  if (normalized.startsWith("data:image/svg+xml")) return "svg";

  try {
    const url = new URL(value);
    const pathname = url.pathname.toLowerCase();
    if (pathname.endsWith(".html") || pathname.endsWith(".htm")) return "html";
    if (pathname.endsWith(".svg")) return "svg";
  } catch {
    if (normalized.endsWith(".html") || normalized.endsWith(".htm")) return "html";
    if (normalized.endsWith(".svg")) return "svg";
  }

  return null;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState(false);

  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [svgUploading, setSvgUploading] = useState(false);

  // Client form state
  const emptyClient = { name: "", email: "", company: "", phone: "", status: "lead", notes: "", plan: "" };
  const [showClientForm, setShowClientForm] = useState(false);
  const [editClient, setEditClient] = useState(emptyClient);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [savingClient, setSavingClient] = useState(false);
  const [projectFormError, setProjectFormError] = useState("");

  const uploadImage = async (file: File): Promise<string> => {
    setImageUploading(true);
    const fileName = `project-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, { upsert: true });
    setImageUploading(false);
    if (error) { alert("خطأ في رفع الصورة: " + error.message); return ""; }
    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };
  const [darkMode, setDarkMode] = useState(true);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, tab]);

  const fetchAll = async () => {
    setLoading(true);
    if (tab === "projects") {
      // Exclude heavy base64 fields from list — load them only when editing
      let { data, error } = await supabase.from("projects")
        .select("id, title, description, client_name, tools, status, image_url, link_url, svg_url, viewer_mode, created_at")
        .order("created_at", { ascending: false });
      if (error && error.message?.includes("viewer_mode")) {
        ({ data, error } = await supabase.from("projects")
          .select("id, title, description, client_name, tools, status, image_url, link_url, svg_url, created_at")
          .order("created_at", { ascending: false }));
      }
      setProjects((data || []).map((project: any) => ({
        ...project,
        viewer_mode: inferViewerMode(project),
      })));
    } else if (tab === "clients") {
      const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      setClients(data || []);
    } else if (tab === "messages") {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      setMessages(data || []);
    }
    setLoading(false);
  };

  const saveProject = async () => {
    if (!editProject.title) return alert("اكتب عنوان المشروع أولاً");
    if (editProject.viewer_mode === "live_n8n") {
      if (!editProject.link_url.trim()) {
        setProjectFormError("أضف رابط public read-only للعرض الحي قبل الحفظ.");
        return;
      }
      if (!isAllowedN8nPreviewUrl(editProject.link_url, import.meta.env.VITE_N8N_PREVIEW_ALLOWED_HOSTS)) {
        setProjectFormError("رابط العرض الحي لازم يكون على domain مسموح لعرض n8n.");
        return;
      }
    }
    setProjectFormError("");
    setSaving(true);
    
    // Build data object — exclude svg_url if column doesn't exist yet
    const projectData: any = {
      title: editProject.title,
      description: editProject.description,
      client_name: editProject.client_name,
      tools: editProject.tools,
      status: editProject.status,
      image_url: editProject.image_url,
      link_url: editProject.link_url,
      viewer_mode: editProject.viewer_mode,
    };
    
    // Try adding svg_url — if column doesn't exist in DB it will cause error
    if (editProject.svg_url) {
      projectData.svg_url = editProject.svg_url;
    }

    let error;
    if (editingId) {
      ({ error } = await supabase.from("projects").update(projectData).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("projects").insert([projectData]));
    }
    
    setSaving(false);
    
    if (error) {
      // Maybe svg_url column doesn't exist — try without it
      if (error.message?.includes("svg_url") || error.message?.includes("viewer_mode")) {
        delete projectData.svg_url;
        delete projectData.viewer_mode;
        const { error: error2 } = editingId
          ? await supabase.from("projects").update(projectData).eq("id", editingId)
          : await supabase.from("projects").insert([projectData]);
        if (error2) {
          alert("خطأ في الحفظ: " + error2.message);
          return;
        }
        alert("⚠️ تم الحفظ بدون بعض حقول العرض الجديدة. أضف viewer_mode و svg_url في Supabase أولاً.");
      } else {
        alert("خطأ في الحفظ: " + error.message);
        return;
      }
    }
    
    setShowForm(false);
    setEditProject(emptyProject);
    setEditingId(null);
    fetchAll();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("هتحذف المشروع ده؟")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchAll();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("هتحذف الرسالة دي؟")) return;
    await supabase.from("messages").delete().eq("id", id);
    fetchAll();
  };

  const deleteClient = async (id: string) => {
    if (!confirm("هتحذف العميل ده؟")) return;
    await supabase.from("clients").delete().eq("id", id);
    fetchAll();
  };

  const saveClient = async () => {
    if (!editClient.name.trim()) return alert("اكتب اسم العميل");
    setSavingClient(true);
    if (editingClientId) {
      await supabase.from("clients").update(editClient).eq("id", editingClientId);
    } else {
      await supabase.from("clients").insert([editClient]);
    }
    setSavingClient(false);
    setShowClientForm(false);
    setEditClient(emptyClient);
    setEditingClientId(null);
    fetchAll();
  };

  const startEditClient = (c: any) => {
    setEditClient({ name: c.name, email: c.email || "", company: c.company || "", phone: c.phone || "", status: c.status || "lead", notes: c.notes || "", plan: c.plan || "" });
    setEditingClientId(c.id);
    setShowClientForm(true);
  };

  const startEdit = async (p: any) => {
    // Fetch full project data including heavy fields for editing
    const { data } = await supabase.from("projects").select("*").eq("id", p.id).single();
    const project = data || p;
    setEditProject({
      ...emptyProject,
      ...project,
      viewer_mode: inferViewerMode(project),
    });
    setProjectFormError("");
    setEditingId(p.id);
    setShowForm(true);
  };

  // ===== Login Screen =====
  if (!authed) {
    return (
      <div className="page-shell admin-space-shell dark min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-white" dir="rtl">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="admin-orbit-badge mx-auto mb-4 h-14 w-14 text-xl">
              M
            </div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-white/40 text-sm mt-1">أدخل كلمة المرور للدخول</p>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <div className="relative mb-4">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="كلمة المرور"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/30 outline-none transition-all ${
                  passError ? "border-red-500" : "border-white/10 focus:border-[#0066ff]"
                }`}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passError && (
              <p className="text-red-400 text-sm mb-4 text-center">كلمة المرور غلط، حاول تاني</p>
            )}

            <button
              onClick={handleLogin}
              className="admin-primary-action w-full"
            >
              دخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== Admin Dashboard =====
  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: "projects", label: "المشاريع", icon: FolderOpen, count: projects.length },
    { key: "clients", label: "العملاء", icon: Users, count: clients.length },
    { key: "messages", label: "الرسائل", icon: MessageSquare, count: messages.length },
  ];

  const dashboardStats = [
    {
      label: "المشاريع النشطة",
      value: projects.filter((project) => project.status === "active").length,
      hint: "مشاريع الأوتوميشن المعروضة",
      icon: FolderOpen,
    },
    {
      label: "العملاء",
      value: clients.length,
      hint: "Pipeline tracking",
      icon: Users,
    },
    {
      label: "الرسائل الواردة",
      value: messages.length,
      hint: "Inbound signal",
      icon: MessageSquare,
    },
    {
      label: "أنظمة Live mirror",
      value: projects.filter((project) => inferViewerMode(project) === "live_n8n" && project.link_url).length,
      hint: "معاينات n8n الجاهزة",
      icon: Gauge,
    },
  ];

  return (
    <div className={`page-shell admin-space-shell ${darkMode ? "dark bg-[#020814] text-white" : "bg-gray-50 text-gray-900"} min-h-screen`} dir="rtl">
      {/* Header */}
      <header className="admin-command-header sticky top-0 z-50 border-b border-white/8 bg-[#020814]/88 backdrop-blur-xl">
        <div className="container flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="admin-orbit-badge">
              M
            </div>
            <div className="hidden md:block">
              <div className="section-eyebrow mb-0 border-white/10 bg-white/5 text-[#9cd8ff]">
                <Sparkles className="h-3.5 w-3.5" />
                Automation admin
              </div>
            </div>
            <span className="font-bold">لوحة إدارة الأوتوميشن</span>
          </div>

          <div className="flex items-center gap-3">
            {/* زرار الموقع الرئيسي */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-command-button"
            >
              <ExternalLink className="w-4 h-4" />
              الموقع
            </a>

            {/* زرار Dark/Light */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="admin-command-button"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* خروج */}
            <button
              onClick={() => setAuthed(false)}
              className="admin-command-button admin-command-button-danger"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="admin-command-deck container px-6 py-8">
        <section className="admin-hero-grid admin-hero-grid-cinematic mb-8">
          <div className="hero-card admin-cockpit-hero overflow-hidden px-6 py-6 md:px-8 md:py-8">
            <div className="hero-accent hero-accent-medium">
              <div className="hero-accent-grid" />
              <div className="hero-accent-beam" />
              <div className="hero-accent-beam hero-accent-beam-secondary" />
              <div className="hero-accent-ring hero-accent-ring-primary" />
              <div className="hero-accent-ring hero-accent-ring-secondary" />
              <div className="hero-accent-scanline" />
              <div className="admin-radar-sweep" />
              <div className="admin-led-cluster admin-led-cluster-left" />
              <div className="admin-led-cluster admin-led-cluster-right" />
            </div>
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3 text-[#9cd8ff]">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.24em]">Automation overview</span>
              </div>
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">
                    مركز إدارة المشاريع والـ workflows
                  </h2>
                </div>

                <div className="admin-signal-panel admin-signal-panel-live">
                  <div className="admin-signal-line">
                    <Activity className="h-4 w-4 text-[#7bf1d3]" />
                    <span>القسم الحالي</span>
                    <span className="admin-signal-value">{tab}</span>
                  </div>
                  <div className="admin-signal-line">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span>وضع العرض</span>
                    <span className="admin-signal-value">{darkMode ? "Dark mode" : "Light mode"}</span>
                  </div>
                  <div className="admin-led-bank" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((item) => (
              <div key={item.label} className="admin-stat-card light-sweep">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="admin-stat-icon">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    signal
                  </span>
                </div>
                <p className="mb-2 text-3xl font-bold text-white">{item.value}</p>
                <p className="text-sm font-semibold text-white/82">{item.label}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#8fd7ff]/70">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <div className="admin-tab-dock mb-8 flex flex-wrap gap-3">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowForm(false); }}
              className={`admin-tab-pill ${
                tab === key
                  ? "admin-tab-pill-active"
                  : "admin-tab-pill-idle"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${tab === key ? "bg-white/16 text-white" : "bg-white/8 text-white/58"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ===== PROJECTS TAB ===== */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">المشاريع</h2>
              <button
                onClick={() => { setShowForm(true); setEditProject(emptyProject); setEditingId(null); setProjectFormError(""); }}
                className="admin-primary-action"
              >
                <Plus className="w-4 h-4" />
                مشروع جديد
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="admin-panel-shell admin-console-form light-sweep rounded-[1.8rem] p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">{editingId ? "تعديل مشروع" : "إضافة مشروع جديد"}</h3>
                  <button onClick={() => { setShowForm(false); setProjectFormError(""); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {projectFormError && (
                  <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {projectFormError}
                  </div>
                )}

                  <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: "title", label: "عنوان المشروع *", placeholder: "مثال: أتمتة إرسال الإيميل" },
                    { key: "client_name", label: "المؤلف (Author)", placeholder: "مثال: Muhammad Nada" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
                      <input
                        value={(editProject as any)[key]}
                        onChange={(e) => setEditProject((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm"
                      />
                    </div>
                  ))}
                  </div>

                  {/* Tools - full width */}
                  <div className="mt-4">
                    <label className="block text-sm text-white/50 mb-1.5">الأدوات <span className="text-white/25 text-xs">(افصل بمسافة)</span></label>
                    <input
                      value={editProject.tools}
                      onChange={(e) => setEditProject((p) => ({ ...p, tools: e.target.value }))}
                      placeholder="n8n Gmail Sheets OpenAI Telegram"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm text-white/50 mb-1.5">نوع العرض</label>
                      <select
                        value={editProject.viewer_mode}
                        onChange={(e) => {
                          const nextMode = e.target.value as ProjectViewerMode;
                          setProjectFormError("");
                          setEditProject((p) => ({
                            ...p,
                            viewer_mode: nextMode,
                          }));
                        }}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0066ff] transition-colors text-sm"
                      >
                        <option value="live_n8n">Live n8n mirror</option>
                        <option value="image_only">Image only</option>
                        <option value="svg_only">SVG legacy viewer</option>
                        <option value="none">No dedicated viewer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-white/50 mb-1.5">رابط العرض الحي</label>
                      <input
                        value={editProject.link_url}
                        onChange={(e) => {
                          setProjectFormError("");
                          setEditProject((p) => ({ ...p, link_url: e.target.value }));
                        }}
                        placeholder="https://your-n8n-preview-url"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm"
                      />
                      <p className="mt-2 text-xs text-white/35">
                        يستخدم فقط مع Live n8n mirror ولازم يكون public read-only.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/50 mb-1.5">صورة المشروع</label>
                    <div className="flex flex-col gap-3">

                      {/* Upload from device - converts to base64 */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editProject.image_url}
                          onChange={(e) => setEditProject((p) => ({ ...p, image_url: e.target.value }))}
                          placeholder="https://... أو ارفع من الجهاز"
                          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm"
                        />
                        <span className="text-white/30 text-xs flex-shrink-0">أو</span>
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 cursor-pointer text-sm hover:border-[#0066ff] hover:text-white text-white/50 transition-colors whitespace-nowrap flex-shrink-0">
                          {imageUploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...</>
                          ) : (
                            <><Upload className="w-4 h-4" /> رفع من الجهاز</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={imageUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              // Check size - max 2MB
                              if (file.size > 2 * 1024 * 1024) {
                                alert("الصورة كبيرة! استخدم صورة أقل من 2MB أو قلل حجمها");
                                return;
                              }
                              setImageUploading(true);
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const base64 = ev.target?.result as string;
                                setEditProject((p) => ({ ...p, image_url: base64 }));
                                setImageUploading(false);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>

                      {/* Preview */}
                      {editProject.image_url && (
                        <div className="flex items-center gap-3">
                          <img
                            src={editProject.image_url}
                            className="w-24 h-16 rounded-lg object-cover border border-white/10"
                            onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                          />
                          <div>
                            <p className="text-xs text-green-400 mb-1">✅ الصورة جاهزة</p>
                            <button
                              type="button"
                              onClick={() => setEditProject((p) => ({ ...p, image_url: "" }))}
                              className="text-xs text-red-400 hover:text-red-300"
                            >حذف</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SVG / HTML Workflow Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/50 mb-1.5">ملف عرض الـ Workflow (SVG أو HTML)</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 text-sm truncate">
                          {editProject.svg_url
                            ? editProject.svg_url.startsWith("https://")
                              ? "✅ " + editProject.svg_url.split("/").pop()
                              : getWorkflowAssetType(editProject.svg_url) === "html"
                                ? "✅ ملف HTML محمّل (قديم)"
                                : "✅ ملف SVG محمّل"
                            : "لم يتم رفع ملف بعد"}
                        </span>
                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0066ff]/40 cursor-pointer text-sm hover:border-[#0066ff] hover:text-white text-[#0066ff] transition-colors whitespace-nowrap flex-shrink-0">
                          {svgUploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...</>
                          ) : (
                            <><Upload className="w-4 h-4" /> رفع SVG أو HTML</>
                          )}
                          <input
                            type="file"
                            accept=".svg,.html,image/svg+xml,text/html"
                            className="hidden"
                            disabled={svgUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setSvgUploading(true);
                              const ext = file.name.endsWith(".html") ? "html" : "svg";
                              const fileName = `workflow-${Date.now()}.${ext}`;
                              const contentType = ext === "html" ? "text/html" : "image/svg+xml";
                              const { error } = await supabase.storage
                                .from("project-workflows")
                                .upload(fileName, file, { contentType, upsert: true });
                              if (error) {
                                alert("خطأ في الرفع: " + error.message);
                                setSvgUploading(false);
                                return;
                              }
                              const { data: urlData } = supabase.storage
                                .from("project-workflows")
                                .getPublicUrl(fileName);
                              setEditProject((p) => ({ ...p, svg_url: urlData.publicUrl }));
                              setSvgUploading(false);
                            }}
                          />
                        </label>
                        {editProject.svg_url && (
                          <button type="button" onClick={() => setEditProject((p) => ({ ...p, svg_url: "" }))}
                            className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs text-red-400 transition-colors">
                            حذف
                          </button>
                        )}
                      </div>
                      {/* Preview — HTML shows badge, SVG shows image */}
                      {editProject.svg_url && (
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0f172a] p-3" style={{ height: 80 }}>
                          {getWorkflowAssetType(editProject.svg_url) === "html" ? (
                            <div className="flex items-center gap-3 h-full">
                              <div className="w-10 h-10 rounded-lg bg-[#0066ff]/20 border border-[#0066ff]/30 flex items-center justify-center text-lg">🌐</div>
                              <div>
                                <p className="text-green-400 text-sm font-semibold">✅ HTML Viewer جاهز</p>
                                <p className="text-white/30 text-xs mt-0.5">سيُعرض تفاعلياً مع zoom وpan</p>
                              </div>
                            </div>
                          ) : (
                            <img src={editProject.svg_url} alt="SVG preview" className="w-full h-full object-contain" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">الحالة</label>
                    <select
                      value={editProject.status}
                      onChange={(e) => setEditProject((p) => ({ ...p, status: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0066ff] transition-colors text-sm"
                    >
                      <option value="active">نشط ✅</option>
                      <option value="inactive">مخفي 🔒</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-white/50 mb-1.5">
                    الوصف
                    <span className="text-white/25 text-xs mr-2">(يدعم Markdown: ## عنوان، **bold**، - قائمة)</span>
                  </label>
                  <textarea
                    value={editProject.description}
                    onChange={(e) => setEditProject((p) => ({ ...p, description: e.target.value }))}
                    placeholder={"## Project Overview\n\nاكتب وصف المشروع هنا...\n\n## Features\n- ميزة 1\n- ميزة 2"}
                    rows={10}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#0066ff] transition-colors text-sm font-mono"
                    style={{ resize: "vertical", minHeight: 200 }}
                  />
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={saveProject}
                    disabled={saving || !editProject.title}
                    className="admin-primary-action disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setProjectFormError(""); }}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Projects List */}
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#0066ff]" /></div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 text-white/30">لا توجد مشاريع بعد</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p: any) => (
                  <div key={p.id} className="admin-panel-shell light-sweep overflow-hidden rounded-[1.6rem] transition-all hover:-translate-y-1 hover:border-primary/30">
                    {p.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold leading-tight">{p.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.status === "active" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                          {p.status === "active" ? "نشط" : "مخفي"}
                        </span>
                      </div>
                      {p.description && <p className="text-white/50 text-sm mb-3 line-clamp-2">{p.description}</p>}
                      {p.tools && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {p.tools.split(/[\s,]+/).map((t: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-[#0066ff]/15 border border-[#0066ff]/20 rounded text-[#0066ff] text-xs">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors">
                          <Edit2 className="w-3 h-3" /> تعديل
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" /> حذف
                        </button>
                        {inferViewerMode(p) === "live_n8n" && p.link_url && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 mr-auto">
                            المعاينة الحية جاهزة
                          </span>
                        )}
                        {inferViewerMode(p) !== "live_n8n" && p.svg_url && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0066ff]/10 border border-[#0066ff]/20 rounded-lg text-xs text-[#0066ff] mr-auto">
                            ✅ SVG موجود
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CLIENTS TAB ===== */}
        {tab === "clients" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">العملاء</h2>
              <button onClick={() => { setEditClient(emptyClient); setEditingClientId(null); setShowClientForm(true); }}
                className="admin-primary-action">
                <Plus className="w-4 h-4" /> إضافة عميل
              </button>
            </div>

            {/* Client Form */}
            {showClientForm && (
              <div className="admin-panel-shell admin-console-form light-sweep rounded-[1.8rem] p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">{editingClientId ? "تعديل عميل" : "إضافة عميل جديد"}</h3>
                  <button onClick={() => setShowClientForm(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {[
                    { key: "name", label: "الاسم *", placeholder: "محمد أحمد" },
                    { key: "email", label: "الإيميل", placeholder: "example@email.com" },
                    { key: "company", label: "الشركة", placeholder: "شركة X" },
                    { key: "phone", label: "الهاتف", placeholder: "+201xxxxxxxxx" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm text-white/50 mb-1.5">{label}</label>
                      <input
                        value={(editClient as any)[key]}
                        onChange={(e) => setEditClient(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm"
                      />
                    </div>
                  ))}

                  {/* Plan Dropdown */}
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">خطة التسعير</label>
                    <select
                      value={editClient.plan}
                      onChange={(e) => setEditClient(p => ({ ...p, plan: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0066ff] transition-colors text-sm"
                    >
                      <option value="">— لم يُحدد بعد —</option>
                      <option value="small">⚡ صغير — $150 إلى $400</option>
                      <option value="medium">🚀 متوسط — $400 إلى $900</option>
                      <option value="large">💎 كبير — $900 إلى $2500</option>
                      <option value="enterprise">🏢 Enterprise — $2500+</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">الحالة</label>
                    <select
                      value={editClient.status}
                      onChange={(e) => setEditClient(p => ({ ...p, status: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0066ff] transition-colors text-sm"
                    >
                      <option value="lead">عميل محتمل 🔵</option>
                      <option value="active">عميل نشط ✅</option>
                      <option value="inactive">غير نشط ⏸️</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm text-white/50 mb-1.5">ملاحظات</label>
                  <textarea
                    value={editClient.notes}
                    onChange={(e) => setEditClient(p => ({ ...p, notes: e.target.value }))}
                    placeholder="أي ملاحظات عن العميل..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm resize-none"
                  />
                </div>

                <button onClick={saveClient} disabled={savingClient}
                  className="admin-primary-action disabled:opacity-50">
                  {savingClient ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</> : <><Save className="w-4 h-4" /> حفظ العميل</>}
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#0066ff]" /></div>
            ) : clients.length === 0 ? (
              <div className="text-center py-16 text-white/30">لا يوجد عملاء بعد</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {clients.map((c) => (
                  <div key={c.id} className="admin-panel-shell light-sweep rounded-[1.6rem] p-5 transition-all hover:-translate-y-1 hover:border-primary/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        {c.company && <p className="text-white/50 text-sm">{c.company}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          c.status === "active" ? "bg-green-500/20 text-green-400" :
                          c.status === "lead" ? "bg-blue-500/20 text-blue-400" :
                          "bg-white/10 text-white/40"
                        }`}>
                          {c.status === "active" ? "عميل نشط" : c.status === "lead" ? "عميل محتمل" : c.status}
                        </span>
                        {c.plan && (
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            c.plan === "enterprise" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                            c.plan === "large"      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                            c.plan === "medium"     ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                            c.plan === "small"      ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                            "bg-white/10 text-white/40"
                          }`}>
                            {{ small: "⚡ صغير $150-400", medium: "🚀 متوسط $400-900", large: "💎 كبير $900-2500", enterprise: "🏢 Enterprise $2500+" }[c.plan] || c.plan}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-white/50">
                      {c.email && <p>📧 {c.email}</p>}
                      {c.phone && <p>📱 {c.phone}</p>}
                      {c.notes && <p className="pt-2 border-t border-white/10 text-white/40 text-xs">{c.notes}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-white/25">{new Date(c.created_at).toLocaleDateString("ar-EG")}</p>
                      <div className="flex gap-2">
                        <button onClick={() => startEditClient(c)} className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors">
                          <Edit2 className="w-3 h-3" /> تعديل
                        </button>
                        <button onClick={() => deleteClient(c.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" /> حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MESSAGES TAB ===== */}
        {tab === "messages" && (
          <div>
            <h2 className="text-xl font-bold mb-6">الرسائل الواردة</h2>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#0066ff]" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-white/30">لا توجد رسائل بعد</div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m) => (
                  <div key={m.id} className="admin-panel-shell light-sweep rounded-[1.6rem] p-5 transition-all hover:-translate-y-1 hover:border-primary/30">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold">{m.name}</h3>
                        <div className="flex gap-4 text-sm text-white/50 mt-0.5">
                          <span>📧 {m.email}</span>
                          {m.company && <span>🏢 {m.company}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-white/30">{new Date(m.created_at).toLocaleDateString("ar-EG")}</span>
                        <button onClick={() => deleteMessage(m.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed bg-white/3 rounded-xl p-3 border border-white/5">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



