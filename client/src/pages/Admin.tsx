import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LogOut, Plus, Trash2, Edit2, Save, X, Loader2,
  MessageSquare, Users, FolderOpen, Eye, EyeOff,
  Sun, Moon, ExternalLink, Upload
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
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  notes: string;
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
  tools: "", status: "active", image_url: "", link_url: "",
};

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
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      setProjects(data || []);
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
    if (!editProject.title) return;
    setSaving(true);
    if (editingId) {
      await supabase.from("projects").update(editProject).eq("id", editingId);
    } else {
      await supabase.from("projects").insert([editProject]);
    }
    setSaving(false);
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

  const startEdit = (p: any) => {
    setEditProject({ ...p });
    setEditingId(p.id);
    setShowForm(true);
  };

  // ===== Login Screen =====
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#0066ff] rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
              M
            </div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-white/40 text-sm mt-1">أدخل كلمة المرور للدخول</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              className="w-full py-3 bg-[#0066ff] hover:bg-[#0055ee] rounded-xl font-semibold text-white transition-colors"
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

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"}`} dir="rtl">
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${darkMode ? "bg-[#0a0a0a]/90 border-white/10" : "bg-white/90 border-gray-200"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0066ff] rounded-lg flex items-center justify-center font-bold text-sm text-white">
              M
            </div>
            <span className="font-bold">لوحة التحكم</span>
          </div>

          <div className="flex items-center gap-3">
            {/* زرار الموقع الرئيسي */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors
                ${darkMode ? "border-white/10 text-white/50 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400"}`}
            >
              <ExternalLink className="w-4 h-4" />
              الموقع
            </a>

            {/* زرار Dark/Light */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors
                ${darkMode ? "border-white/10 text-white/50 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400"}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* خروج */}
            <button
              onClick={() => setAuthed(false)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors
                ${darkMode ? "border-white/10 text-white/50 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400"}`}
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowForm(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-[#0066ff] text-white"
                  : darkMode
                    ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${tab === key ? "bg-white/20" : "bg-white/10"}`}>
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
                onClick={() => { setShowForm(true); setEditProject(emptyProject); setEditingId(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0066ff] hover:bg-[#0055ee] rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                مشروع جديد
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">{editingId ? "تعديل مشروع" : "إضافة مشروع جديد"}</h3>
                  <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: "title", label: "عنوان المشروع *", placeholder: "مثال: أتمتة إرسال الإيميل" },
                    { key: "client_name", label: "اسم العميل", placeholder: "مثال: شركة X" },
                    { key: "tools", label: "الأدوات (افصل بفاصلة)", placeholder: "n8n, Gmail, Sheets" },
                    { key: "link_url", label: "رابط المشروع (للمعاينة المحمية)", placeholder: "https://..." },
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

                  {/* Image Upload */}
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
                              // Check size - max 500KB
                              if (file.size > 500 * 1024) {
                                alert("الصورة كبيرة! استخدم صورة أقل من 500KB أو قلل حجمها");
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
                  <label className="block text-sm text-white/50 mb-1.5">الوصف</label>
                  <textarea
                    value={editProject.description}
                    onChange={(e) => setEditProject((p) => ({ ...p, description: e.target.value }))}
                    placeholder="وصف تفصيلي للمشروع..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 outline-none focus:border-[#0066ff] transition-colors text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={saveProject}
                    disabled={saving || !editProject.title}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0066ff] hover:bg-[#0055ee] disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
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
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
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
                          {p.tools.split(",").map((t: string, i: number) => (
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
                        {p.link_url && (
                          <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors mr-auto">
                            <Eye className="w-3 h-3" /> عرض
                          </a>
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
            <h2 className="text-xl font-bold mb-6">العملاء</h2>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#0066ff]" /></div>
            ) : clients.length === 0 ? (
              <div className="text-center py-16 text-white/30">لا يوجد عملاء بعد</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {clients.map((c) => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{c.name}</h3>
                        {c.company && <p className="text-white/50 text-sm">{c.company}</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        c.status === "active" ? "bg-green-500/20 text-green-400" :
                        c.status === "lead" ? "bg-blue-500/20 text-blue-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {c.status === "active" ? "عميل نشط" : c.status === "lead" ? "عميل محتمل" : c.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-white/50">
                      {c.email && <p>📧 {c.email}</p>}
                      {c.phone && <p>📱 {c.phone}</p>}
                      {c.notes && <p className="pt-2 border-t border-white/10 text-white/40">{c.notes}</p>}
                    </div>
                    <p className="text-xs text-white/25 mt-3">
                      {new Date(c.created_at).toLocaleDateString("ar-EG")}
                    </p>
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
                  <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
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
