import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import SharedHeader from "@/components/SharedHeader";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Zap, BarChart3, Workflow, MessageSquare, Database, Smartphone, X, ExternalLink, Loader2, CheckCircle2, Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "+201061455162";
const EMAIL = "mimi.n8n27@gmail.com";
const PROFILE_IMAGE = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663184092711/chMVOfHjJrgiCnQs.jpg?Expires=1804200577&Signature=sN3sPs37BpgdweMsjeL-Z8AzrW2vUPHHX-WBZd~G46ra1UMc8g1SZBMOqq~Mgeip4Fa9vqHw833HnXfkoVKesbyy6~jE8OKps6EF5khCHuxQx50s1XCjzEQwcEQjNS~oQ6dNeC6B2BWYdhKM1wx4LAMB5SanMIE3jWyTnLD-nDdTREulWizkkKrbQJfUkKSu4UwJYZiZ--GlWKoORqhfDU0ORGuR-x2WDzApRZvT0f9WL1hjmnGcE-q3AKfOSBLIKE32R7bwAzzvsYwQup~-BUwRdNodsbXKF7FecmdTUft8J0RC102BmlS584KtPxdCHPBMlotCtCN7Pdbf08Y15A__&Key-Pair-Id=K2HSFNDJXOU9YS";

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

function MarkdownText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className} dir="auto" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} style={{ lineHeight: 1.7, textAlign: "start" }} />
  );
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^---$/gm, '').replace(/^#{1,3} /gm, '').replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1').replace(/^\|.+\|$/gm, '').replace(/^- /gm, '')
    .replace(/^\d+\. /gm, '').replace(/\n+/g, ' ').trim();
}

interface Project {
  id: string; title: string; description: string; client_name: string;
  tools: string; status: string; image_url?: string; svg_url?: string;
  link_url?: string; created_at: string;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group ${open ? "border-primary shadow-md shadow-primary/10" : "border-border hover:border-primary/50"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5 gap-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{question}</h3>
        <span className={`text-primary font-bold text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">{answer}</div>}
    </div>
  );
}

export default function Home() {
  const { t, lang, dir } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, client_name, tools, status, image_url, link_url, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
    setProjectsLoading(false);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(/[\s,]+/).map((tool) => tool.trim()).filter(Boolean) : [];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`, "_blank");

  const expertise = [
    { title: t("expertise.1.title"), description: t("expertise.1.desc"), icon: "📊" },
    { title: t("expertise.2.title"), description: t("expertise.2.desc"), icon: "🏗️" },
    { title: t("expertise.3.title"), description: t("expertise.3.desc"), icon: "⚙️" },
  ];

  const solutions = [
    { title: t("solutions.1.title"), description: t("solutions.1.desc") },
    { title: t("solutions.2.title"), description: t("solutions.2.desc") },
    { title: t("solutions.3.title"), description: t("solutions.3.desc") },
    { title: t("solutions.4.title"), description: t("solutions.4.desc") },
  ];

  const niches = [
    { name: "Social Media Automation", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Email Marketing & CRM", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "E-commerce Automation", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Lead Generation", icon: <Zap className="w-5 h-5" /> },
    { name: "Analytics & Reporting", icon: <Database className="w-5 h-5" /> },
    { name: "Customer Support", icon: <Workflow className="w-5 h-5" /> },
  ];

  const workSteps = [
    { n: 1, title: t("howIWork.step1.title"), desc: t("howIWork.step1.desc"), deliverable: t("howIWork.step1.deliverable"), duration: t("howIWork.step1.duration") },
    { n: 2, title: t("howIWork.step2.title"), desc: t("howIWork.step2.desc"), deliverable: t("howIWork.step2.deliverable"), duration: t("howIWork.step2.duration") },
    { n: 3, title: t("howIWork.step3.title"), desc: t("howIWork.step3.desc"), deliverable: t("howIWork.step3.deliverable"), duration: t("howIWork.step3.duration") },
    { n: 4, title: t("howIWork.step4.title"), desc: t("howIWork.step4.desc"), deliverable: t("howIWork.step4.deliverable"), duration: t("howIWork.step4.duration") },
    { n: 5, title: t("howIWork.step5.title"), desc: t("howIWork.step5.desc"), deliverable: t("howIWork.step5.deliverable"), duration: t("howIWork.step5.duration") },
    { n: 6, title: t("howIWork.step6.title"), desc: t("howIWork.step6.desc"), deliverable: t("howIWork.step6.deliverable"), duration: t("howIWork.step6.duration") },
  ];

  const whyItems = [
    { title: t("howIWork.why.1.title"), desc: t("howIWork.why.1.desc") },
    { title: t("howIWork.why.2.title"), desc: t("howIWork.why.2.desc") },
    { title: t("howIWork.why.3.title"), desc: t("howIWork.why.3.desc") },
    { title: t("howIWork.why.4.title"), desc: t("howIWork.why.4.desc") },
  ];

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") }, { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") }, { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") }, { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") }, { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
  ];

  // Testimonials
  const testimonials = lang === "ar" ? [
    { name: "أحمد الشهري", role: "مدير عمليات", company: "شركة تقنية", text: "محمد غيّر طريقة عملنا بالكامل. وفّرنا أكثر من 30 ساعة أسبوعياً بعد تطبيق نظام الـ Automation.", stars: 5 },
    { name: "Sarah K.", role: "Founder", company: "E-commerce Brand", text: "Professional, fast, and the system he built works flawlessly. Our lead response time went from hours to minutes.", stars: 5 },
    { name: "خالد المنصور", role: "صاحب مشروع", company: "متجر إلكتروني", text: "أفضل استثمار عملته لشركتي. النظام يعمل 24/7 بدون أي تدخل مني.", stars: 5 },
  ] : [
    { name: "Ahmed Al-Shahri", role: "Operations Manager", company: "Tech Company", text: "Muhammad completely transformed how we work. We saved over 30 hours per week after implementing the automation system.", stars: 5 },
    { name: "Sarah K.", role: "Founder", company: "E-commerce Brand", text: "Professional, fast, and the system he built works flawlessly. Our lead response time went from hours to minutes.", stars: 5 },
    { name: "Khaled Al-Mansour", role: "Business Owner", company: "Online Store", text: "Best investment I made for my company. The system runs 24/7 without any intervention from me.", stars: 5 },
  ];

  // Why Me points
  const whyMePoints = lang === "ar" ? [
    { icon: "🎯", title: "أفهم مشكلتك أولاً", desc: "مش بفكر في الأدوات من الأول — بفهم العملية وبقرر إذا كانت الـ Automation هي الحل الصح فعلاً" },
    { icon: "📋", title: "توثيق شامل مع كل مشروع", desc: "مش بسلمك شغل وبروح — بسلمك نظام + PDF كامل + فيديو شرح + Training session" },
    { icon: "⚡", title: "نتائج حقيقية وقابلة للقياس", desc: "كل Workflow بيتبني بهدف واضح: توفير وقت، تقليل أخطاء، أو زيادة إيرادات" },
    { icon: "🔒", title: "موثوقية وأمان", desc: "أنظمتي مبنية بـ Error Handling صح وـ Logging كامل — مش بتوقف وبتديك تحكم كامل في بياناتك" },
  ] : [
    { icon: "🎯", title: "I Understand Your Problem First", desc: "I don't think about tools first — I understand your process and decide if automation is actually the right solution" },
    { icon: "📋", title: "Full Documentation With Every Project", desc: "I don't just deliver and disappear — you get a working system + full PDF + video walkthrough + training session" },
    { icon: "⚡", title: "Real, Measurable Results", desc: "Every workflow is built with a clear goal: saving time, reducing errors, or increasing revenue" },
    { icon: "🔒", title: "Reliability & Security", desc: "My systems are built with proper error handling and full logging — they don't break and give you full control over your data" },
  ];

  // Trusted tools logos (SVG-based)
  const trustedTools = [
    { name: "n8n", color: "#ea4b71", bg: "#fff0f3", letter: "n8n" },
    { name: "Zapier", color: "#ff4a00", bg: "#fff3f0", letter: "Zap" },
    { name: "Make", color: "#6d00cc", bg: "#f5f0ff", letter: "Make" },
    { name: "OpenAI", color: "#10a37f", bg: "#f0fdf9", letter: "AI" },
    { name: "Supabase", color: "#3ecf8e", bg: "#f0fdf4", letter: "SB" },
    { name: "Telegram", color: "#0088cc", bg: "#f0f8ff", letter: "TG" },
    { name: "WhatsApp", color: "#25d366", bg: "#f0fdf4", letter: "WA" },
    { name: "Google Sheets", color: "#0f9d58", bg: "#f0fdf4", letter: "GS" },
  ];

  const pricingPlans = [
    { name: "Small", desc: lang === "ar" ? "Workflow بسيط + 1-2 nodes" : "Basic workflow + 1–2 nodes", base: "$150–$400", final: "$200–$450", hours: "4-8h", popular: false },
    { name: "Medium", desc: lang === "ar" ? "Logic + Notifications + 3-5 nodes" : "Logic + Notifications + 3–5 nodes", base: "$400–$900", final: "$500–$1,050", hours: "8-15h", popular: true },
    { name: "Large", desc: lang === "ar" ? "Workflow معقد + APIs + Error Handling" : "Complex workflow + APIs + Error Handling", base: "$900–$2,500+", final: "$1,050–$2,800+", hours: "15-30h", popular: false },
    { name: "Enterprise", desc: lang === "ar" ? "نظام كامل + Multi API + قابل للتوسع" : "Full System + Multi API + Scalable", base: "$2,500+", final: "$2,750+", hours: "30h+", popular: false },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground" dir={dir}>
      <SharedHeader />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-24 md:py-36">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(99,179,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-500/15 border border-blue-400/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-300 text-sm font-medium">{t("hero.badge")}</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1]">
                {lang === "ar" ? (
                  <>أنظمة <span className="text-blue-400">Automation</span><br />تشتغل وأنت نايم</>
                ) : (
                  <>Automation Systems<br />That Work <span className="text-blue-400">While You Sleep</span></>
                )}
              </h1>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
                {t("hero.desc")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={handleWhatsApp}
                  className="bg-blue-500 hover:bg-blue-400 text-white text-base font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5 gap-2"
                >
                  {t("hero.cta.start")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => scrollTo("portfolio-section")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-base px-8 py-6 rounded-xl gap-2"
                >
                  {lang === "ar" ? "شوف أعمالي" : "See My Work"}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-white/10">
                {[
                  { num: "50+", label: lang === "ar" ? "مشروع Automation" : "Automation Projects" },
                  { num: "50+", label: lang === "ar" ? "عميل راضٍ" : "Happy Clients" },
                  { num: "24/7", label: lang === "ar" ? "عمل تلقائي" : "Automated Work" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black text-blue-400">{stat.num}</p>
                    <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img src={PROFILE_IMAGE} alt="Muhammad" className="w-full h-[480px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white">M</div>
                    <div>
                      <p className="text-white font-bold text-sm">Muhammad</p>
                      <p className="text-blue-300 text-xs">Automation Systems Architect</p>
                    </div>
                    <div className="mr-auto flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUSTED TOOLS ═══════════════ */}
      <section className="py-12 bg-slate-50 border-b border-border">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest font-semibold">
            {lang === "ar" ? "أدوات أعمل بيها يومياً" : "Tools I Work With Daily"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {trustedTools.map((tool, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black" style={{ background: tool.bg, color: tool.color }}>
                  {tool.letter.length <= 2 ? tool.letter : tool.letter[0]}
                </div>
                <span className="text-sm font-semibold text-foreground">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY ME ═══════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">
              {lang === "ar" ? "ليه أنا تحديداً؟" : "Why Choose Me?"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              {lang === "ar" ? "مش بس Automation —" : "Not Just Automation —"}
              <br />
              <span className="text-primary">{lang === "ar" ? "شراكة حقيقية" : "A Real Partnership"}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {lang === "ar"
                ? "في ناس كتير بتعمل Automation. الفرق في الطريقة والنتائج."
                : "Many people do automation. The difference is in the approach and the results."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyMePoints.map((point, i) => (
              <div key={i} className="flex gap-5 p-6 bg-slate-50 rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-xl text-2xl shadow-sm border border-border group-hover:scale-110 transition-transform">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{point.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERTISE ═══════════════ */}
      <section id="expertise-section" className="py-20 md:py-28 bg-slate-50 border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("expertise.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">{t("expertise.desc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((item, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO ═══════════════ */}
      <section id="portfolio-section" className="py-20 md:py-28 bg-white border-t border-border">
        <div className="container">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("portfolio.title")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">{t("portfolio.desc")}</p>
            </div>
            <a href="/portfolio" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all">
              {lang === "ar" ? "كل الأعمال" : "View All"} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {projectsLoading ? (
            <div className="flex justify-center items-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground"><p className="text-xl">{t("portfolio.empty")}</p></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div key={project.id} onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer bg-white rounded-2xl border border-border hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <div className="text-center"><div className="text-4xl mb-2">⚙️</div><p className="text-xs text-muted-foreground">{t("portfolio.noImage")}</p></div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{project.title}</h3>
                    {project.description && <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{stripMarkdown(project.description)}</p>}
                    {project.tools && (
                      <div className="flex flex-wrap gap-2">
                        {toolsList(project.tools).slice(0, 4).map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 rounded-md text-primary text-xs font-medium">{tool}</span>
                        ))}
                        {toolsList(project.tools).length > 4 && <span className="px-2 py-1 bg-slate-100 rounded-md text-muted-foreground text-xs">+{toolsList(project.tools).length - 4}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 md:py-28 bg-slate-950 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-500/15 text-blue-400 text-sm font-bold rounded-full mb-4 border border-blue-500/20">
              {lang === "ar" ? "ماذا يقول عملائي" : "What Clients Say"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {lang === "ar" ? "نتائج حقيقية،" : "Real Results,"}
              <span className="text-blue-400"> {lang === "ar" ? "عملاء حقيقيون" : "Real Clients"}</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t_item, i) => (
              <div key={i} className="bg-slate-900 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(t_item.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <Quote className="w-6 h-6 text-blue-500/40 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t_item.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {t_item.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t_item.name}</p>
                    <p className="text-slate-500 text-xs">{t_item.role} · {t_item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SOLUTIONS ═══════════════ */}
      <section id="solutions-section" className="py-20 md:py-28 bg-white border-t border-border">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-16">{t("solutions.title")}</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {solutions.map((solution, index) => (
              <div key={index} className="p-7 bg-slate-50 rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1.5">{solution.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NICHES ═══════════════ */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-border">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 text-center">{t("niches.title")}</h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">{t("niches.desc")}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {niches.map((niche, index) => (
              <div key={index} className="p-5 bg-white rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 flex items-center gap-4 group">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all">{niche.icon}</div>
                <h3 className="font-semibold text-foreground">{niche.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing-section" className="py-20 md:py-28 bg-white border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("pricing.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("pricing.desc")}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5 mb-10">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${plan.popular ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105" : "bg-slate-50 border border-border hover:border-primary hover:shadow-lg hover:-translate-y-1"}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full">{t("pricing.popular")}</span>
                  </div>
                )}
                <h3 className={`text-xl font-black mb-1 ${plan.popular ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <p className={`text-xs mb-5 leading-relaxed ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>{plan.desc}</p>
                <div className={`rounded-xl p-4 mb-4 ${plan.popular ? "bg-white/15" : "bg-white border border-border"}`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 font-semibold ${plan.popular ? "text-white/60" : "text-muted-foreground"}`}>{t("pricing.basePrice")}</p>
                  <p className={`text-2xl font-black ${plan.popular ? "text-white" : "text-primary"}`}>{plan.base}</p>
                </div>
                <p className={`text-xs mb-5 flex items-center gap-1 ${plan.popular ? "text-white/60" : "text-muted-foreground"}`}>🕐 {plan.hours}</p>
                <div className={`rounded-xl p-4 mb-5 ${plan.popular ? "bg-white/15" : "bg-primary/5 border border-primary/10"}`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 font-semibold ${plan.popular ? "text-white/60" : "text-muted-foreground"}`}>{t("pricing.finalPrice")}</p>
                  <p className={`text-lg font-black ${plan.popular ? "text-white" : "text-foreground"}`}>{plan.final}</p>
                </div>
                <button onClick={() => scrollTo("contact-section")} className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-auto ${plan.popular ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"}`}>
                  {plan.popular ? t("pricing.getStarted") : t("pricing.learnMore")}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{t("pricing.customDesc")}</p>
            <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
              {t("pricing.viewFull")} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW I WORK ═══════════════ */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("howIWork.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("howIWork.desc")}</p>
          </div>
          <div className="relative">
            <div className="absolute right-[28px] top-8 bottom-8 w-0.5 bg-primary/20 hidden md:block" />
            {workSteps.map((step, i) => (
              <div key={i} className="flex gap-6 mb-10 group">
                <div className="flex-shrink-0 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform z-10">{step.n}</div>
                <div className="flex-1 pb-8 border-b border-border last:border-0">
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{step.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-sm text-foreground"><span className="font-semibold">{t("howIWork.deliverable")}:</span> {step.deliverable}</p>
                    <p className="text-sm text-foreground"><span className="font-semibold">{t("howIWork.duration")}:</span> {step.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-black text-foreground mb-6 text-center">{t("howIWork.why.title")}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {whyItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("faq.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("faq.desc")}</p>
          </div>
          <div className="space-y-4 mb-12">
            {faqs.map((faq, i) => <FaqItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{t("faq.cta")}</p>
            <button onClick={() => scrollTo("contact-section")} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
              {t("faq.cta.btn")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact-section" className="py-20 md:py-28 bg-slate-50 border-t border-border">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{t("contact.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.desc")}</p>
          </div>
          <ContactForm whatsappNumber={WHATSAPP_NUMBER} email={EMAIL} />
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-slate-950 text-white pt-16 pb-8">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white">M</div>
                <span className="font-black text-xl">Muhammad</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5">{t("footer.desc")}</p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/25 transition-colors text-xs font-bold">WA</a>
                <a href={`mailto:${EMAIL}`}
                  className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/25 transition-colors text-xs font-bold">@</a>
                <a href="https://github.com/mimin8n27-beep" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors text-xs font-bold">GH</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-white/60 uppercase text-xs tracking-wider">{t("footer.links")}</h4>
              <ul className="space-y-2.5">
                {[
                  { label: t("footer.home"), action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                  { label: t("footer.pricing"), action: () => scrollTo("pricing-section") },
                  { label: t("footer.contact"), action: () => scrollTo("contact-section") },
                ].map((link, i) => (
                  <li key={i}><button onClick={link.action} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</button></li>
                ))}
                <li><a href="/portfolio" className="text-slate-400 hover:text-white text-sm transition-colors">{t("nav.portfolio")}</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white/60 uppercase text-xs tracking-wider">{t("footer.getInTouch")}</h4>
              <ul className="space-y-3">
                <li><a href={`mailto:${EMAIL}`} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {EMAIL}</a></li>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2"><Zap className="w-4 h-4" /> WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">{t("footer.rights")}</p>
            <p className="text-slate-500 text-sm">{t("footer.subtitle")}</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════ MODAL ═══════════════ */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-y-auto flex-1">
              {selectedProject.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6" dir={dir}>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-black text-foreground leading-tight flex-1 ml-4">{selectedProject.title}</h2>
                  <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                {selectedProject.client_name && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>👤</span><span>{t("portfolio.author")}: <span className="text-foreground font-medium">{selectedProject.client_name}</span></span>
                  </div>
                )}
                {selectedProject.description && <MarkdownText text={selectedProject.description} className="text-muted-foreground text-sm mb-6" />}
                {selectedProject.tools && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-3 font-semibold">{t("portfolio.toolsUsed")}</p>
                    <div className="flex flex-wrap gap-2">
                      {toolsList(selectedProject.tools).map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-sm font-medium">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-border bg-white rounded-b-2xl flex-shrink-0" dir={dir}>
              <a href={`/portfolio?open=${selectedProject.id}`} className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold text-white transition-colors">
                <ExternalLink className="w-4 h-4" /> {t("portfolio.viewProject")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
