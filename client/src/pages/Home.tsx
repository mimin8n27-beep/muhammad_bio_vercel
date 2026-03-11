import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import SharedHeader from "@/components/SharedHeader";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Zap, BarChart3, Workflow, MessageSquare, Database, Smartphone, Github, X, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Design Philosophy: Modern Tech Aesthetic
 * - Clean, professional layout with high contrast
 * - Grid-based structure with sharp lines
 * - Blue technical color scheme (#0066ff)
 * - Poppins for headings, Inter for body text
 * - Smooth animations and transitions
 */

const WHATSAPP_NUMBER = "+201064998737";
const EMAIL = "mimi.n8n27@gmail.com";
const GITHUB_URL = "https://github.com/mimin8n27-beep";
const PROFILE_IMAGE = "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663184092711/chMVOfHjJrgiCnQs.jpg?Expires=1804200577&Signature=sN3sPs37BpgdweMsjeL-Z8AzrW2vUPHHX-WBZd~G46ra1UMc8g1SZBMOqq~Mgeip4Fa9vqHw833HnXfkoVKesbyy6~jE8OKps6EF5khCHuxQx50s1XCjzEQwcEQjNS~oQ6dNeC6B2BWYdhKM1wx4LAMB5SanMIE3jWyTnLD-nDdTREulWizkkKrbQJfUkKSu4UwJYZiZ--GlWKoORqhfDU0ORGuR-x2WDzApRZvT0f9WL1hjmnGcE-q3AKfOSBLIKE32R7bwAzzvsYwQup~-BUwRdNodsbXKF7FecmdTUft8J0RC102BmlS584KtPxdCHPBMlotCtCN7Pdbf08Y15A__&Key-Pair-Id=K2HSFNDJXOU9YS";

// Simple Markdown renderer
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
    <div
      className={className}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
      style={{ lineHeight: 1.7, textAlign: "start" }}
    />
  );
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^---$/gm, '')
    .replace(/^#{1,3} /gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^\|.+\|$/gm, '')
    .replace(/^- /gm, '')
    .replace(/^\d+\. /gm, '')
    .replace(/\n+/g, ' ')
    .trim();
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group
        ${open ? "border-primary shadow-md shadow-primary/10" : "border-border hover:border-primary/50"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5 gap-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{question}</h3>
        <span className={`text-primary font-bold text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("expertise");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Don't fetch svg_url (heavy base64) — load lazily when needed
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, client_name, tools, status, image_url, link_url, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (!error && data) setProjects(data);
    setProjectsLoading(false);
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean) : [];

  const expertise = [
    {
      title: "تحليل سير العمل",
      description: "فهم دقيق للمنطق التشغيلي الحالي وتحديد نقاط التحسين",
      icon: "📊",
    },
    {
      title: "تصميم المعمارية",
      description: "بناء هياكل قابلة للتوسع ومصممة خصيصاً لاحتياجاتك",
      icon: "🏗️",
    },
    {
      title: "أنظمة متقدمة",
      description: "حلول ذكية تعمل 24/7 مع تحكم كامل في البيانات والقرارات",
      icon: "⚙️",
    },
  ];

  const tools = [
    { name: "n8n", icon: "🔴", description: "منصة قوية للأتمتة" },
    { name: "Zapier", icon: "⚡", description: "ربط التطبيقات" },
    { name: "Make", icon: "🟣", description: "أتمتة مرنة" },
  ];

  const solutions = [
    {
      title: "إدارة العملاء المحتملين",
      description: "من الاستحواذ الأولي وحتى إتمام الصفقة",
    },
    {
      title: "أتمتة العمليات الداخلية",
      description: "تبسيط التنسيق بين الأقسام والفرق",
    },
    {
      title: "دمج الذكاء الاصطناعي",
      description: "استخدام AI كمحرك لاتخاذ القرارات",
    },
    {
      title: "أتمتة شاملة",
      description: "تقليل التدخل البشري والأخطاء المتكررة",
    },
  ];

  const niches = [
    { name: "Social Media Automation", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Email Marketing & CRM", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "E-commerce Automation", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Lead Generation", icon: <Zap className="w-5 h-5" /> },
    { name: "Analytics & Reporting", icon: <Database className="w-5 h-5" /> },
    { name: "Customer Support", icon: <Workflow className="w-5 h-5" /> },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header Navigation */}
      <SharedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-lg">
                <span className="text-sm font-semibold text-primary">
                  متخصص في أتمتة الأعمال الرقمية
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Muhammad أنا
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                أبني أنظمة أتمتة رقمية متكاملة للشركات الصغيرة والمتوسطة باستخدام تقنيات حديثة،
                لخفض التكاليف وزيادة الكفاءة التشغيلية إلى أقصى حد ممكن.
              </p>

              <div className="flex gap-4">
                <Button
                  onClick={() => scrollTo("contact-section")}
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                >
                  تواصل معي
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2"
                >
                  ابدأ مشروعك الآن
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-12 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">عملية أتمتة</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">عميل راضٍ</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">عمل تلقائي</p>
                </div>
              </div>
            </div>

            <div className="animate-slideInRight relative">
              <div className="relative h-96 md:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/10">
                <img
                  src={PROFILE_IMAGE}
                  alt="محمد - متخصص في أتمتة الأعمال"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise-section" className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              خبرتي العملية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              أركز على تحليل عميق وتصميم معماريات متقدمة لبناء أنظمة أتمتة فعالة وقابلة للتوسع
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {expertise.map((item, index) => (
              <div
                key={index}
                className="group p-8 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 md:py-32 bg-secondary/30 border-t border-border">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-center">
            أدواتي الأساسية
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{tool.name}</h3>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>
            ))}
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663184092711/5MnDUtM4VGYpdQp79PzkMf/automation-tools-visual-aci4HV4cLntViBzNTquURM.webp"
              alt="Automation Tools Integration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO SECTION ===== */}
      <section id="portfolio-section" className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              معرض الأعمال
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              مشاريع حقيقية نفذتها باستخدام تقنيات الأتمتة الحديثة
            </p>
          </div>

          {projectsLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">سيتم إضافة المشاريع قريباً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => openModal(project)}
                  className="group cursor-pointer bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="text-4xl mb-2">⚙️</div>
                          <p className="text-xs">لا توجد صورة</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {stripMarkdown(project.description)}
                      </p>
                    )}

                    {project.tools && (
                      <div className="flex flex-wrap gap-2">
                        {toolsList(project.tools).slice(0, 4).map((tool, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 rounded-md text-primary text-xs font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                        {toolsList(project.tools).length > 4 && (
                          <span className="px-2 py-1 bg-secondary rounded-md text-muted-foreground text-xs">
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
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions-section" className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16">
            الحلول التي أقدمها
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="p-8 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{solution.title}</h3>
                    <p className="text-muted-foreground">{solution.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663184092711/5MnDUtM4VGYpdQp79PzkMf/workflow-process-visual-fQ6qNuSyS9u5e8QcLjyYHh.webp"
              alt="Workflow Process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section className="py-20 md:py-32 bg-secondary/30 border-t border-border">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            مجالات التخصص
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            أركز على مجالات محددة حيث أستطيع تقديم أفضل القيمة والنتائج
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {niches.map((niche, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 flex items-center gap-4 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                  {niche.icon}
                </div>
                <h3 className="font-semibold text-foreground">{niche.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing-section" className="py-20 md:py-32 bg-[#f8faff] border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple & Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the right automation package for your project. All prices include support and documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: "Small",
                desc: "Basic workflow / trigger + 1–2 nodes",
                base: "$150–$400",
                premium: ["PDF Documentation: +$50", "Video Demo: +$100", "1 Week Support: +$50"],
                final: "$200–$450",
                hours: "4-8 hours",
                popular: false,
              },
              {
                name: "Medium",
                desc: "Logic + Notifications + 3–5 nodes",
                base: "$400–$900",
                premium: ["PDF Documentation: +$50–$100", "Video Demo: +$100–$200", "2 Weeks Support: +$80–$150"],
                final: "$500–$1,050",
                hours: "8-15 hours",
                popular: true,
              },
              {
                name: "Large",
                desc: "Complex workflow + Error Handling + APIs",
                base: "$900–$2,500+",
                premium: ["PDF Documentation: +$100–$150", "Video Demo: +$150–$300", "3 Weeks Support: +$100–$200"],
                final: "$1,050–$2,800+",
                hours: "15-30 hours",
                popular: false,
              },
              {
                name: "Enterprise",
                desc: "Full System + Multi API + Scalable",
                base: "$2,500+",
                premium: ["Full Suite (PDF + Video + Support)", "Options: +$250–$600+"],
                final: "$2,750+",
                hours: "30+ hours",
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border-2 p-6 flex flex-col transition-all duration-300 group
                  ${plan.popular
                    ? "border-primary shadow-xl shadow-primary/20 bg-white scale-105"
                    : "border-border bg-white hover:border-primary hover:shadow-lg hover:-translate-y-1"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>

                <div className="bg-blue-50 rounded-xl p-4 mb-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Base Price</p>
                  <p className="text-2xl font-bold text-primary">{plan.base}</p>
                </div>

                <div className="mb-5 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Premium Options</p>
                  <ul className="space-y-1.5">
                    {plan.premium.map((opt, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Final Price</p>
                  <p className="text-xl font-bold text-foreground">{plan.final}</p>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-4 flex items-center justify-center gap-1">
                  <span>🕐</span> {plan.hours}
                </p>

                <button
                  onClick={() => scrollTo("contact-section")}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                    ${plan.popular
                      ? "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/30"
                      : "border-2 border-border text-foreground hover:border-primary hover:text-primary"
                    }`}
                >
                  {plan.popular ? "Get Started" : "Learn More"}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Need a custom solution? Let's discuss your specific requirements.</p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              View Full Pricing Details
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW I WORK SECTION ===== */}
      <section className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How I Work With You
            </h2>
            <p className="text-lg text-muted-foreground">
              A structured, professional approach to building automation systems that actually work.
            </p>
          </div>

          <div className="relative">
            <div className="absolute right-[28px] top-8 bottom-8 w-0.5 bg-blue-100 hidden md:block" />
            {[
              {
                n: 1,
                title: "Initial Consultation",
                desc: "I analyze your problem before thinking about tools. I understand your current process, identify pain points, and determine if automation is the right solution.",
                deliverable: "Professional proposal with realistic timeline",
                duration: "1–2 days",
              },
              {
                n: 2,
                title: "Discovery & Design",
                desc: "I ask detailed questions about your workflows, data sources, systems, and desired outcomes. Then I create a complete automation blueprint showing entry points, logic, processing, and error handling.",
                deliverable: "Automation Discovery Notes + Blueprint",
                duration: "2–3 days",
              },
              {
                n: 3,
                title: "Implementation",
                desc: "I build the actual workflow with proper logic, data processing, error handling, and logging. This is where the blueprint becomes a working system.",
                deliverable: "Working automation system",
                duration: "Depends on complexity",
              },
              {
                n: 4,
                title: "Testing & Optimization",
                desc: "I test every component, integration points, edge cases, and stress scenarios. I ensure the system is stable, reliable, and handles unexpected situations gracefully.",
                deliverable: "Stable, tested system",
                duration: "2–3 days",
              },
              {
                n: 5,
                title: "Premium Delivery",
                desc: "You get the complete package: the working system, comprehensive PDF documentation, a training session (30–60 min), and a video walkthrough showing how everything works.",
                deliverable: "System + Docs + Training + Video",
                duration: "1–2 days",
              },
              {
                n: 6,
                title: "Post-Delivery Support",
                desc: "I provide short-term support (7–14 days) to fix any issues. I also identify opportunities for additional automations and improvements to maximize your system's value.",
                deliverable: "Ongoing support & optimization",
                duration: "7–14 days",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 mb-10 group">
                <div className="flex-shrink-0 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-200 z-10">
                  {step.n}
                </div>
                <div className="flex-1 pb-8 border-b border-border last:border-0 group-hover:translate-x-1 transition-transform duration-200">
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{step.desc}</p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Deliverable:</span> {step.deliverable}
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    <span className="font-semibold">Duration:</span> {step.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Why This Works */}
          <div className="mt-8 bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">Why This Approach Works</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Professional & Structured", desc: "Every project follows a proven system" },
                { title: "Reduces Errors", desc: "Thorough testing catches issues early" },
                { title: "Increases Value", desc: "Complete documentation & training included" },
                { title: "Long-term Success", desc: "Post-delivery support ensures sustainability" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
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

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 md:py-32 bg-[#f8faff] border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about working with me on automation projects.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {[
              {
                q: "How do you determine if my project needs automation?",
                a: "During the initial consultation, I analyze your current process, identify pain points, and assess whether automation will actually solve your problem. Not every process needs automation—sometimes a simple tool or workflow change is better. I'm honest about what will and won't work for your situation.",
              },
              {
                q: "What if my project is more complex than expected?",
                a: "If your project scope expands during development, I'll discuss it with you before proceeding. I provide realistic estimates based on the discovery phase, but if we discover new requirements, we'll adjust the timeline and cost together—no surprises.",
              },
              {
                q: "Can I upgrade my plan after starting?",
                a: "Absolutely. If you start with a Small plan and later realize you need more features, we can upgrade to a Medium or Large plan. The additional cost will be calculated fairly based on the extra work required.",
              },
              {
                q: "What tools do you use for automation?",
                a: "I primarily use n8n, Zapier, and Make. The choice depends on your specific needs, budget, and technical requirements. n8n is powerful and cost-effective for complex workflows, while Zapier is great for simple integrations. I'll recommend the best tool for your project.",
              },
              {
                q: "Do you offer payment plans?",
                a: "Yes, I can work with you on flexible payment arrangements. For larger projects, we can discuss milestone-based payments or payment plans. Let's discuss what works best for your budget.",
              },
              {
                q: "Will I understand how the system works?",
                a: "Absolutely. As part of the delivery, I provide comprehensive documentation, a training session, and a video walkthrough. I explain everything in a way that makes sense to you, so you can manage and modify the system if needed.",
              },
              {
                q: "How long does a typical project take?",
                a: "It depends on complexity. Small projects take 4–8 hours, Medium projects 8–15 hours, and Large projects 15–30+ hours. This includes discovery, design, implementation, testing, and delivery. I provide realistic timelines upfront.",
              },
              {
                q: "Can you integrate with my existing tools?",
                a: "Most likely, yes. I work with CRMs, email platforms, Google Sheets, Notion, Slack, and hundreds of other tools. If your tool has an API or Zapier integration, I can connect it. During discovery, I'll confirm which tools can be integrated.",
              },
              {
                q: "What if I need ongoing support after the initial project?",
                a: "I offer ongoing support packages for maintenance, updates, and new feature additions. As your business grows and your automation needs evolve, I can help you scale the system. Think of me as your long-term automation partner.",
              },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Still have questions? Let's talk!</p>
            <button
              onClick={() => scrollTo("contact-section")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact-section" className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              تواصل معي الآن
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              هل لديك مشروع في الذهن؟ أو تريد معرفة المزيد عن خدماتي؟ تواصل معي عبر النموذج أدناه أو الطرق السريعة.
            </p>
          </div>
          <ContactForm whatsappNumber={WHATSAPP_NUMBER} email={EMAIL} />
        </div>
      </section>

      {/* ===== NEW FOOTER ===== */}
      <footer className="bg-[#0a0a0a] text-white pt-16 pb-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-bold text-sm">M</div>
                <span className="font-bold text-lg">Muhammad</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Building automation systems that scale your business and reduce manual work.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-white/80 uppercase text-xs tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                  { label: "Pricing", action: () => scrollTo("pricing-section") },
                  { label: "Contact", action: () => scrollTo("contact-section") },
                ].map((link, i) => (
                  <li key={i}>
                    <button onClick={link.action} className="text-white/50 hover:text-white text-sm transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get in Touch */}
            <div>
              <h4 className="font-bold mb-4 text-white/80 uppercase text-xs tracking-wider">Get in Touch</h4>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${EMAIL}`} className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> {EMAIL}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2">
                    <Zap className="w-4 h-4" /> WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">© 2026 Muhammad. All rights reserved.</p>
            <p className="text-white/30 text-sm">Automation Systems Architect | Building scalable solutions for SMBs</p>
          </div>
        </div>
      </footer>

      {/* ===== PROJECT MODAL ===== */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {selectedProject.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6" dir="rtl">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground leading-tight flex-1 ml-4">{selectedProject.title}</h2>
                  <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                {selectedProject.client_name && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>👤</span>
                    <span>المؤلف: <span className="text-foreground font-medium">{selectedProject.client_name}</span></span>
                  </div>
                )}
                {selectedProject.description && (
                  <MarkdownText text={selectedProject.description} className="text-muted-foreground text-sm mb-6" />
                )}
                {selectedProject.tools && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground mb-3 font-semibold">الأدوات المستخدمة</p>
                    <div className="flex flex-wrap gap-2">
                      {toolsList(selectedProject.tools).map((tool, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-sm font-medium">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky button at bottom */}
            {selectedProject.svg_url && (
              <div className="p-4 border-t border-border bg-white rounded-b-2xl flex-shrink-0" dir="rtl">
                <a
                  href={`/portfolio?open=${selectedProject.id}`}
                  className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  عرض المشروع
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
