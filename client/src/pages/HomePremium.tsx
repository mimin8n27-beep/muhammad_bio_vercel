import ContactFormPremium from "@/components/ContactFormPremium";
import SharedHeaderPremium from "@/components/SharedHeaderPremium";
import { HeroAccent } from "@/components/site/HeroAccent";
import { MotionReveal } from "@/components/site/MotionReveal";
import { SectionIntro } from "@/components/site/SectionIntro";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SurfaceCard } from "@/components/site/SurfaceCard";
import { stripMarkdown } from "@/components/site/SafeRichText";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Clock3,
  Database,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const WHATSAPP_NUMBER = "+201061455162";
const EMAIL = "mimi.n8n27@gmail.com";
const PROFILE_IMAGE =
  "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663184092711/chMVOfHjJrgiCnQs.jpg?Expires=1804200577&Signature=sN3sPs37BpgdweMsjeL-Z8AzrW2vUPHHX-WBZd~G46ra1UMc8g1SZBMOqq~Mgeip4Fa9vqHw833HnXfkoVKesbyy6~jE8OKps6EF5khCHuxQx50s1XCjzEQwcEQjNS~oQ6dNeC6B2BWYdhKM1wx4LAMB5SanMIE3jWyTnLD-nDdTREulWizkkKrbQJfUkKSu4UwJYZiZ--GlWKoORqhfDU0ORGuR-x2WDzApRZvT0f9WL1hjmnGcE-q3AKfOSBLIKE32R7bwAzzvsYwQup~-BUwRdNodsbXKF7FecmdTUft8J0RC102BmlS584KtPxdCHPBMlotCtCN7Pdbf08Y15A__&Key-Pair-Id=K2HSFNDJXOU9YS";

interface Project {
  id: string;
  title: string;
  description: string;
  client_name: string;
  tools: string;
  status: string;
  image_url?: string;
  created_at: string;
}

const expertise = [
  {
    title: "تشخيص التشغيـل قبل البناء",
    description: "أراجع الرحلة كاملة أولًا: أين تبدأ البيانات، أين تتعطل، وأين يدخل العنصر اليدوي الذي يمكن تحويله إلى أوتوميشن أوضح.",
    icon: Workflow,
  },
  {
    title: "Architecture قابلة للتوسع",
    description: "كل workflow يُبنى ليعيش مع النمو، مع logic واضحة ومرونة في إضافة integrations جديدة بدون تعقيد مؤذٍ.",
    icon: Boxes,
  },
  {
    title: "Automation مدعومة بالـ AI",
    description: "أجمع بين n8n و APIs و AI steps عندما تكون مفيدة فعلًا في السرعة، الدقة، وجودة تجربة العميل.",
    icon: Bot,
  },
];

const pillars = [
  {
    title: "التقاط العملاء المحتملين بدون تسريب",
    description: "من أول رسالة حتى التأهيل والمتابعة، يظل الـ pipeline يتحرك بدون مطاردة يدوية أو فقدان لطلبات مهمة.",
    icon: MessageSquareText,
  },
  {
    title: "تقارير أسرع وقرارات أوضح",
    description: "Dashboards وتنبيهات وتقارير دورية تُبنى تلقائيًا بدل الانتظار للتجميع اليدوي أو الملفات المبعثرة.",
    icon: BarChart3,
  },
  {
    title: "ربط الأدوات في نظام واحد",
    description: "CRM و WhatsApp و Gmail و Google Sheets والأنظمة الداخلية يشتغلون كمنظومة واحدة متزامنة وأقل عرضة للأخطاء.",
    icon: Database,
  },
];

const faqs = [
  {
    q: "كيف تعرف إذا كانت العملية مناسبة للأوتوميشن؟",
    a: "أنظر إلى التكرار، الوقت الضائع، احتمالية الخطأ البشري، وتأثير التأخير على الفريق أو العميل. إذا كانت خطوة تتكرر كثيرًا وتستهلك وقتًا بلا قيمة مباشرة، فهي غالبًا مرشح ممتاز للأوتوميشن.",
  },
  {
    q: "هل يمكن تطوير workflow موجودة بدل بنائها من الصفر؟",
    a: "نعم. أحيانًا أفضل نتيجة تأتي من تحسين الموجود بالفعل: ضبط الـ inputs، إصلاح نقاط الفشل، وتخفيف الفوضى داخل الـ flow بدل إعادة البناء الكامل.",
  },
  {
    q: "ما الذي يجعل التسليم مريحًا وآمنًا للفريق؟",
    a: "أبني logic واضحة، أوثق المهم، وأسلّم النظام بحيث يكون مفهومًا بعد الإطلاق وليس فقط أثناء التنفيذ. الهدف أن يعتمد عليه فريقك بثقة.",
  },
];

function FaqCard({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <SurfaceCard
      className={`card-tilt cursor-pointer p-5 transition-all duration-300 ${open ? "border-primary/30 shadow-[0_22px_60px_rgba(73,166,255,0.18)]" : ""}`}
      onClick={() => setOpen((value) => !value)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{question}</h3>
        <span
          className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </div>
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ${
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-sm leading-7 text-muted-foreground">{answer}</div>
      </div>
    </SurfaceCard>
  );
}

export default function HomePremium() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("scroll") === "contact") {
      requestAnimationFrame(() => {
        document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    let alive = true;

    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, client_name, tools, status, image_url, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (alive) {
        setProjects(data || []);
        setLoadingProjects(false);
      }
    };

    fetchProjects();
    return () => {
      alive = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      { value: "50+", label: "سيناريو أوتوميشن منفذ", icon: Sparkles },
      { value: "24/7", label: "تشغيل مستمر بدون متابعة يدوية", icon: Clock3 },
      { value: "n8n + AI", label: "تنفيذ ذكي وربط بين الأدوات", icon: ShieldCheck },
    ],
    [],
  );

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <div className="page-shell dark">
      <SharedHeaderPremium />

      <main>
        <section className="relative overflow-hidden px-4 pb-14 pt-8 md:pb-20">
          <div className="hero-card container relative overflow-hidden px-7 py-10 md:px-10 md:py-14">
            <HeroAccent intensity="high" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_0.82fr] lg:items-center">
              <MotionReveal variant="beam-sweep" intensity="medium" distance={28}>
                <span className="section-eyebrow">أنظمة الأوتوميشن</span>
                <h1 className="mb-5 max-w-[12ch] bg-[linear-gradient(135deg,#ffffff_0%,#d0f0ff_46%,#a0ffe8_100%)] bg-clip-text text-[clamp(3rem,5.6vw,5.75rem)] font-bold leading-[0.94] text-transparent drop-shadow-[0_0_22px_rgba(73,166,255,0.22)]">
                  أبني أنظمة أوتوميشن تربط أدواتك وتقلل التشغيل اليدوي بشكل فاخر وواضح.
                </h1>
                <p className="mb-8 max-w-2xl text-[1.08rem] leading-8 text-[#ccdcf0]">
                  شغلي يتركّز على بناء workflows احترافية تجمع بين n8n و integrations و AI steps بحيث يصبح التشغيل أسرع،
                  والردود أوضح، والمتابعة أدق، والبيانات متصلة بين الأدوات بدل ما تكون مشتتة.
                </p>

                <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact-section"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_48px_rgba(73,166,255,0.40)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_60px_rgba(109,255,211,0.28)]"
                  >
                    ابدأ مشروعك
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/portfolio"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full border border-primary/18 bg-white/6 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                  >
                    شاهد الأعمال
                  </a>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="metric-card card-tilt relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(109,255,211,0.9),transparent)]" />
                      <metric.icon className="mb-3 h-5 w-5 text-primary" />
                      <p className="mb-1 text-xl font-bold">{metric.value}</p>
                      <p className="text-[0.84rem] text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-1 grid gap-3 sm:grid-cols-3">
                  {[
                    "n8n workflows مصممة حسب العملية",
                    "Integrations بين الأدوات بدون فوضى",
                    "Automation premium تخدم التشغيل الحقيقي",
                  ].map((signal, index) => (
                    <MotionReveal
                      key={signal}
                      delay={0.12 + index * 0.06}
                      intensity="soft"
                      variant="dock-slide"
                    >
                      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[0.82rem] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur">
                        {signal}
                      </div>
                    </MotionReveal>
                  ))}
                </div>
              </MotionReveal>

              <MotionReveal delay={0.08} variant="parallax" intensity="medium" parallaxRange={14}>
                <div className="surface-card-glow overflow-hidden rounded-[1.8rem] p-2.5">
                  <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.45rem] border border-white/20">
                    <img
                      src={PROFILE_IMAGE}
                      alt="Muhammad portrait"
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#040912] via-[#040912]/54 to-transparent p-5 text-white">
                      <p className="mb-1 text-sm uppercase tracking-[0.22em] text-[#8fd7ff]">Automation specialist</p>
                        <p className="text-xl font-semibold">n8n, integrations, AI workflows</p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(109,255,211,0.14),transparent_38%)]" />
                    <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/14 bg-[#06101f]/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bceeff] backdrop-blur">
                      مشغّل الأوتوميشن
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="section-frame px-7 py-10 md:px-10 md:py-12">
              <MotionReveal variant="glow-pop" intensity="high">
                <SectionIntro
                  eyebrow="What I optimize"
                      title="الأوتوميشن الحقيقي يبدأ من فهم العملية وليس من كثرة الأدوات"
                      description="القيمة ليست في شكل الـ workflow فقط، بل في جودة التصميم: مدخلات واضحة، مسار تنفيذ مضبوط، وربط أنظف بين الأدوات التي تعتمد عليها يوميًا."
                />
              </MotionReveal>

              <div className="feature-grid md:grid-cols-3">
                {expertise.map((item, index) => (
                  <MotionReveal key={item.title} delay={index * 0.08} variant="glow-pop" intensity="high">
                    <SurfaceCard className="card-tilt h-full p-6">
                      <div className="feature-icon mb-5">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                      <p className="leading-7 text-muted-foreground">{item.description}</p>
                    </SurfaceCard>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="section-frame px-7 py-10 md:px-10 md:py-12">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <MotionReveal variant="beam-sweep" intensity="high">
                  <SectionIntro
                    eyebrow="نتائج التنفيذ"
                    title="متابعة يدوية أقل. سرعة أوضح. وثقة أكبر في كل خطوة."
                    description="هذه هي المساحات التي يظهر فيها أثر الأوتوميشن بسرعة: استجابة أسرع، أخطاء أقل، وربط أفضل بين التشغيل والتقارير."
                  />
                </MotionReveal>

                <div className="feature-grid">
                  {pillars.map((pillar, index) => (
                    <MotionReveal key={pillar.title} delay={index * 0.08} variant="dock-slide" intensity="high">
                      <SurfaceCard className="card-tilt flex h-full gap-4 p-6">
                        <div className="feature-icon shrink-0">
                          <pillar.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold">{pillar.title}</h3>
                          <p className="leading-7 text-muted-foreground">{pillar.description}</p>
                        </div>
                      </SurfaceCard>
                    </MotionReveal>
                  ))}
                </div>
              </div>
            </div> 
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="section-frame px-7 py-10 md:px-10 md:py-12">
              <MotionReveal variant="glow-pop" intensity="high">
                <SectionIntro
                  eyebrow="أعمال مختارة"
                  title="نماذج من أنظمة الأوتوميشن التي تم تنفيذها"
                  description="أمثلة على workflows وربط أنظمة وحالات استخدام عملية صُممت لتحسين التشغيل ورفع جودة المتابعة والتنفيذ."
                />
              </MotionReveal>

              {loadingProjects ? (
                <div className="grid gap-5 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="surface-card p-5">
                      <div className="skeleton-block mb-4 aspect-video w-full" />
                      <div className="skeleton-block mb-3 h-6 w-3/4" />
                      <div className="skeleton-block mb-2 h-4 w-full" />
                      <div className="skeleton-block h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
                  {projects.map((project, index) => (
                    <MotionReveal key={project.id} delay={index * 0.08} variant="glow-pop" intensity="high">
                      <a href={`/portfolio?open=${project.id}`} className="block">
                        <SurfaceCard className="card-tilt h-full p-4">
                          <div className="light-sweep mb-4 overflow-hidden rounded-[1.3rem] border border-white/15">
                            {project.image_url ? (
                              <img
                                src={project.image_url}
                                alt={project.title}
                                loading="lazy"
                                className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,rgba(36,107,255,0.14),rgba(123,241,211,0.14))]">
                                <Workflow className="h-10 w-10 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <span className="pill-label text-[11px]">حالة تنفيذ</span>
                          </div>
                          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                            {stripMarkdown(project.description)}
                          </p>
                        </SurfaceCard>
                      </a>
                    </MotionReveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <MotionReveal variant="beam-sweep" intensity="high">
              <div className="cta-band px-8 py-10 md:px-12 md:py-12">
                <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <span className="section-eyebrow border-white/15 bg-white/8 text-white/80">
                      Delivery process
                    </span>
                    <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                      فهم العملية، تصميم الـ workflow، تنفيذ الأوتوميشن، ثم تسليم واضح وقابل للاعتماد.
                    </h2>
                    <p className="max-w-2xl text-[#c8ddf0]">
                      التنفيذ عندي ليس مجرد شكل بصري. أبدأ بالتشخيص، ثم أبني architecture مناسبة، ثم أنفذ وأختبر حتى يصل لفريقك نظام أوتوميشن جاهز للاستخدام الفعلي.
                    </p>
                  </div>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b1730] transition-transform hover:-translate-y-0.5"
                  >
                    تحدث عبر WhatsApp
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </MotionReveal>
          </div>
        </section>

        <section className="site-section">
          <div className="container">
            <div className="section-frame px-7 py-10 md:px-10 md:py-12">
              <MotionReveal variant="glow-pop" intensity="high">
                <SectionIntro
                  eyebrow="الأسئلة الشائعة"
                  title="أسئلة مهمة قبل بدء أي مشروع أوتوميشن"
                  description="إجابات مختصرة وواضحة تساعدك تعرف هل الأوتوميشن مناسب لاحتياجك الآن وما الشكل الأنسب للتنفيذ."
                  align="center"
                />
              </MotionReveal>

              <div className="mx-auto grid max-w-3xl gap-4">
                {faqs.map((faq, index) => (
                  <MotionReveal key={faq.q} delay={index * 0.06} variant="dock-slide" intensity="high">
                    <FaqCard question={faq.q} answer={faq.a} />
                  </MotionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact-section" className="site-section">
          <div className="container">
            <div className="section-frame px-7 py-10 md:px-10 md:py-12">
              <MotionReveal variant="beam-sweep" intensity="high">
                <SectionIntro
                  eyebrow="ابدأ الآن"
                  title="هات العملية المرهقة أو المتعبة وسنحوّلها إلى أوتوميشن يخدم شغلك بوضوح."
                  description="إذا كان فريقك يكرر نفس الخطوات، أو تضيع الطلبات بين الأدوات، أو التقارير تتأخر، فهذه بالضبط المساحة التي نبني لها نظام أوتوميشن أقوى."
                  align="center"
                />
              </MotionReveal>
              <MotionReveal delay={0.08} variant="glow-pop" intensity="high">
                <ContactFormPremium
                  whatsappNumber={WHATSAPP_NUMBER}
                  email={EMAIL}
                  source="home"
                />
              </MotionReveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        homeHref="/"
        homeLabel="العودة للرئيسية"
        note="شغلي في الأوتوميشن يركّز على n8n و integrations و AI workflows التي تقلل الوقت الضائع وترفع جودة التنفيذ."
      />
    </div>
  );
}
