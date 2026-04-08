import ContactFormPremium from "@/components/ContactFormPremium";
import SharedHeaderPremium from "@/components/SharedHeaderPremium";
import { HeroAccent } from "@/components/site/HeroAccent";
import { MotionReveal } from "@/components/site/MotionReveal";
import { SceneBackdrop } from "@/components/site/SceneBackdrop";
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
    title: "Operational diagnosis",
    description: "We map your flow first, then remove friction points instead of throwing tools at the problem.",
    icon: Workflow,
  },
  {
    title: "Reliable architecture",
    description: "Each workflow is designed for scale, visibility, and future integrations without becoming brittle.",
    icon: Boxes,
  },
  {
    title: "AI-enabled execution",
    description: "Language models, routing logic, and automations work together where they create real business value.",
    icon: Bot,
  },
];

const pillars = [
  {
    title: "Lead capture that never leaks",
    description: "From first touch to qualification, your pipeline keeps moving without manual chasing.",
    icon: MessageSquareText,
  },
  {
    title: "Reporting without spreadsheet pain",
    description: "Stakeholders get clean snapshots, alerts, and trends without waiting on manual exports.",
    icon: BarChart3,
  },
  {
    title: "Data orchestration between tools",
    description: "CRMs, internal docs, email, and operational systems stay synchronized with fewer mistakes.",
    icon: Database,
  },
];

const faqs = [
  {
    q: "How do you decide if automation is worth it?",
    a: "I look at frequency, delay, repetition, and the cost of human error. If a manual step is low value but high repetition, it usually becomes a good automation candidate.",
  },
  {
    q: "Can you improve an existing workflow instead of rebuilding it?",
    a: "Yes. In many cases, the fastest win is improving what you already have: fixing failure paths, tightening inputs, and restructuring the noisy parts.",
  },
  {
    q: "What makes the delivery feel safe for my team?",
    a: "I document the core logic, reduce hidden steps, and keep a clear handoff path so the system is understandable after launch, not just during development.",
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
      { value: "50+", label: "Automations delivered", icon: Sparkles },
      { value: "24/7", label: "Always-on systems", icon: Clock3 },
      { value: "Less chaos", label: "Safer handoffs and logic", icon: ShieldCheck },
    ],
    [],
  );

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <div className="page-shell dark">
      <SharedHeaderPremium />

      <main>
        <section className="relative overflow-hidden px-4 pb-14 pt-8 md:pb-20">
          <SceneBackdrop intensity="high" />
          <div className="hero-card container relative overflow-hidden px-7 py-10 md:px-10 md:py-14">
            <HeroAccent intensity="high" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_0.82fr] lg:items-center">
              <MotionReveal variant="beam-sweep" intensity="medium" distance={28}>
                <span className="section-eyebrow">Cinematic system interface</span>
                <h1 className="mb-5 max-w-[12ch] bg-[linear-gradient(135deg,#ffffff_0%,#d0f0ff_46%,#a0ffe8_100%)] bg-clip-text text-[clamp(3rem,5.6vw,5.75rem)] font-bold leading-[0.94] text-transparent drop-shadow-[0_0_22px_rgba(73,166,255,0.22)]">
                  Automation systems with a sci-fi pulse and cinematic precision.
                </h1>
                <p className="mb-8 max-w-2xl text-[1.08rem] leading-8 text-[#ccdcf0]">
                  We turn operations into something that feels intelligent on the surface and reliable underneath:
                  sharper lead flow, calmer execution, clearer reporting, and a visual identity that feels like it came
                  from a near-future control room.
                </p>

                <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact-section"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_48px_rgba(73,166,255,0.40)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_60px_rgba(109,255,211,0.28)]"
                  >
                    Start a project
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/portfolio"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full border border-primary/18 bg-white/6 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                  >
                    View selected work
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
                    "Reactive interface overlays",
                    "Layered motion with ambient depth",
                    "Futuristic polish without hiding content",
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
                      <p className="mb-1 text-sm uppercase tracking-[0.22em] text-[#8fd7ff]">Automation architect</p>
                        <p className="text-xl font-semibold">Strategy, systems, delivery</p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(109,255,211,0.14),transparent_38%)]" />
                    <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/14 bg-[#06101f]/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bceeff] backdrop-blur">
                      Visual command layer
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
                  title="A calmer system underneath the work your team already does"
                  description="The visual layer now feels more intentional, but the real value still comes from strong system design: clear entry points, healthier data flow, and safer execution paths."
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
                    eyebrow="Core outcomes"
                    title="Less manual follow-up. More confidence in what happens next."
                    description="These are the categories where automation tends to create visible wins quickly without making the operation feel over-engineered."
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
                  eyebrow="Recent work"
                  title="Selected systems and workflow builds"
                  description="A cleaner teaser view with safer content handling and lighter loading. Each card is decorative-first, then detail-on-demand."
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
                            <span className="pill-label text-[11px]">Case study</span>
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
                      Delivery rhythm
                    </span>
                    <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                      Discovery, architecture, implementation, then a cinematic handoff.
                    </h2>
                    <p className="max-w-2xl text-[#c8ddf0]">
                      The atmosphere feels futuristic, but the delivery remains grounded: diagnose, design, build,
                      test, then ship a system your team can trust in the real world.
                    </p>
                  </div>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sci-fi-button inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b1730] transition-transform hover:-translate-y-0.5"
                  >
                    Chat on WhatsApp
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
                  eyebrow="FAQ"
                  title="Questions teams usually ask before they automate"
                  description="These answers are now easier to scan and carry clearer visual state changes so the section feels lighter to browse."
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
                  eyebrow="Contact"
                  title="Bring the messy workflow. We&apos;ll turn it into something calmer."
                  description="Better visuals help the brand feel stronger. Better systems keep the business moving. The contact flow has been tightened so it feels smoother and safer at the same time."
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
        homeLabel="Return to home signal"
        note="Automation systems that now feel more like a futuristic command deck than a repeated navigation bar."
      />
    </div>
  );
}
