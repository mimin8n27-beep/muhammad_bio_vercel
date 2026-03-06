import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("expertise");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    setProjectsLoading(false);
  };

  const toolsList = (tools: string) =>
    tools ? tools.split(",").map((t) => t.trim()).filter(Boolean) : [];

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
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Muhammad</h1>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => scrollTo("portfolio-section")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              معرض الأعمال
            </button>
            <button
              disabled
              className="text-sm text-muted-foreground/40 cursor-not-allowed"
              title="قريباً"
            >
              خطط التسعير
            </button>
            <button
              onClick={() => scrollTo("contact-section")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              تواصل معي
            </button>
          </nav>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all"
          >
            <Github className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold text-foreground">GitHub</span>
          </a>
        </div>
      </header>

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
                  onClick={() => setSelectedProject(project)}
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
                        {project.description}
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

      {/* Contact Section */}
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

      {/* Vision Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">رؤيتي</h2>
            <p className="text-lg md:text-xl leading-relaxed mb-8">
              لا يقتصر عملي على أتمتة خطوة واحدة، بل يمتد إلى بناء نظام بيئي متكامل يهدف إلى تقليل الاعتماد البشري
              لأقصى درجة، مما يوفر للعملاء وقتًا ثمينًا وموارد مالية كبيرة، ويساهم في تحقيق نمو مستدام وفعالية
              تشغيلية لا مثيل لها.
            </p>
            <Button
              onClick={() => scrollTo("contact-section")}
              className="bg-white text-primary hover:bg-white/90 gap-2"
            >
              ابدأ مشروعك الآن
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-muted-foreground">
              © 2026 محمد - متخصص في أتمتة الأعمال الرقمية
            </p>
            <div className="flex gap-6">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                البريد الإلكتروني
              </a>
            </div>
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
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProject.image_url && (
              <div className="aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6" dir="rtl">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground leading-tight flex-1 ml-4">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {selectedProject.client_name && (
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>👤</span>
                  <span>العميل: <span className="text-foreground font-medium">{selectedProject.client_name}</span></span>
                </div>
              )}

              {selectedProject.description && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {selectedProject.description}
                </p>
              )}

              {selectedProject.tools && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold">
                    الأدوات المستخدمة
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {toolsList(selectedProject.tools).map((tool, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.link_url && (
                <a
                  href={selectedProject.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center py-3 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-colors"
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
