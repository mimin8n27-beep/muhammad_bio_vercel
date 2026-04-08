import { MotionReveal } from "@/components/site/MotionReveal";
import { supabase } from "@/lib/supabase";
import SharedHeaderPremium from "@/components/SharedHeaderPremium";
import { ArrowRight, CheckCircle, CheckCircle2, Loader2, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

const WHATSAPP_NUMBER = "+201061455162";
const EMAIL = "mimi.n8n27@gmail.com";

const plans = [
  {
    name: "Small",
    desc: "Basic workflow automation",
    hours: "4-8 hours",
    features: ["Basic workflow or trigger", "1-2 automation nodes", "Simple logic flow"],
    basePrice: "$150 - $400",
    premiumOptions: [
      { label: "PDF documentation", price: "+$50" },
      { label: "Video demo", price: "+$100" },
      { label: "1 week support", price: "+$50" },
    ],
    finalPrice: "$200 - $450",
    popular: false,
  },
  {
    name: "Medium",
    desc: "Intermediate automation workflows",
    hours: "8-15 hours",
    features: ["Workflow logic and notifications", "3-5 automation nodes", "Multi-step processes", "Basic error handling"],
    basePrice: "$400 - $900",
    premiumOptions: [
      { label: "PDF documentation", price: "+$50 - $100" },
      { label: "Video demo", price: "+$100 - $200" },
      { label: "2 weeks support", price: "+$80 - $150" },
    ],
    finalPrice: "$500 - $1,050",
    popular: true,
  },
  {
    name: "Large",
    desc: "Advanced automation systems",
    hours: "15-30 hours",
    features: ["Complex workflow logic", "Error handling and validation", "API integrations", "Data transformation", "Advanced monitoring"],
    basePrice: "$900 - $2,500+",
    premiumOptions: [
      { label: "PDF documentation", price: "+$100 - $150" },
      { label: "Video demo", price: "+$150 - $300" },
      { label: "3 weeks support", price: "+$100 - $200" },
    ],
    finalPrice: "$1,050 - $2,800+",
    popular: false,
  },
  {
    name: "Enterprise",
    desc: "Full automation system",
    hours: "30+ hours",
    features: ["Full automation architecture", "Multiple APIs and integrations", "Scalable infrastructure", "Custom workflows", "Dedicated support", "Performance optimization"],
    basePrice: "$2,500+",
    premiumOptions: [{ label: "Documentation, demo, and support suite", price: "+$250 - $600+" }],
    finalPrice: "$2,750+",
    popular: false,
  },
];

const faqs = [
  { q: "Can I customize the pricing?", a: "Yes. Pricing can shift based on scope, integrations, and delivery expectations." },
  { q: "What is included in support?", a: "Support covers fixes, small adjustments, and technical guidance based on the selected plan." },
  { q: "Do you offer payment plans?", a: "Yes. We can agree on a payment structure that fits the project size and timeline." },
  { q: "What if the project needs more time?", a: "If scope expands, we discuss the extra work before moving forward." },
  { q: "Can I upgrade later?", a: "Absolutely. You can start with a smaller package and expand once the workflow grows." },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`surface-card card-tilt overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group ${
        open ? "border-primary/40 shadow-[0_20px_50px_rgba(31,122,255,0.16)]" : "hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-primary">{question}</h3>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xl font-bold text-primary transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </div>
      {open && <div className="border-t border-border/50 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">{answer}</div>}
    </div>
  );
}

export default function Pricing() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { error: supabaseError } = await supabase.from("messages").insert([formData]);
      if (supabaseError) throw supabaseError;

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", company: "", message: "" });
        setSubmitted(false);
      }, 3000);
    } catch {
      setError("Something went wrong while sending. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello Muhammad, I am ${formData.name || "a potential client"} and I would like to discuss an automation project.`,
  )}`;
  const emailLink = `mailto:${EMAIL}?subject=Pricing inquiry`;

  return (
    <div className="page-shell pricing-page-shell dark min-h-screen text-foreground">
      <div className="pricing-top-aurora" aria-hidden="true">
        <div className="pricing-top-aurora-orb pricing-top-aurora-orb-a" />
        <div className="pricing-top-aurora-orb pricing-top-aurora-orb-b" />
        <div className="pricing-top-aurora-grid" />
        <div className="pricing-top-aurora-beam pricing-top-aurora-beam-a" />
        <div className="pricing-top-aurora-beam pricing-top-aurora-beam-b" />
      </div>

      <SharedHeaderPremium />

      <section className="pricing-hero-shell border-b border-border py-20 text-center md:py-28">
        <div className="container mx-auto max-w-4xl">
          <MotionReveal variant="fade-up">
            <div className="pricing-hero-card">
              <div className="pricing-hero-accent" aria-hidden="true">
                <span className="pricing-hero-spark pricing-hero-spark-a" />
                <span className="pricing-hero-spark pricing-hero-spark-b" />
                <span className="pricing-hero-spark pricing-hero-spark-c" />
              </div>
              <span className="pricing-eyebrow">Pricing control</span>
              <h1 className="pricing-hero-title">Pricing Plans</h1>
              <p className="pricing-hero-copy">
                Stronger contrast, cleaner hierarchy, and motion-rich pricing cards that feel alive instead of washed out.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, i) => (
              <MotionReveal key={plan.name} variant="scale-in" delay={i * 0.08}>
                <div
                  className={`pricing-plan-card card-tilt relative flex h-full flex-col rounded-2xl border-2 transition-all duration-500 group ${
                    plan.popular
                      ? "surface-card pricing-plan-card-popular overflow-visible border-primary shadow-2xl shadow-primary/20"
                      : "surface-card border-border hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_22px_70px_rgba(0,0,0,0.26)]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                      <span className="pricing-popular-badge">
                        <span className="pricing-popular-badge-dot" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-1 text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="mb-5 text-sm text-muted-foreground">{plan.desc}</p>

                    <div className="mb-5">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Time</p>
                      <p className="text-xl font-bold text-white">{plan.hours}</p>
                    </div>

                    <div className="mb-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-white/92">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pricing-price-box mb-4 rounded-xl border border-primary/15 bg-primary/10 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Price</p>
                      <p className="text-2xl font-bold text-primary">{plan.basePrice}</p>
                    </div>

                    <div className="mb-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Premium Options</p>
                      <ul className="space-y-1.5">
                        {plan.premiumOptions.map((option, index) => (
                          <li key={index} className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>{option.label}</span>
                            <span className="font-semibold text-white">{option.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pricing-final-box mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Final Price Range</p>
                      <p className="text-xl font-bold text-primary">{plan.finalPrice}</p>
                    </div>

                    <a
                      href="#contact-section"
                      className={`sci-fi-button mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                          : "border-2 border-border text-white hover:border-primary hover:text-primary"
                      }`}
                    >
                      Contact Me
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-section" className="border-t border-border py-20">
        <div className="container mx-auto max-w-2xl" dir="rtl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Start your automation project</h2>
            <p className="text-muted-foreground">Choose the right package, send your details, and I will help you shape the best automation setup for your business.</p>
          </div>

          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 animate-bounce text-primary" />
              <h3 className="mb-2 text-2xl font-bold">Message sent successfully</h3>
              <p className="text-muted-foreground">Your message was received and I will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="surface-card space-y-5 rounded-[1.6rem] p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Muhammad Ahmed"
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-white transition-all placeholder:text-[#91a9ca] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">?Full name????</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@gmail.com"
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-white transition-all placeholder:text-[#91a9ca] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="??? Company"
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-white transition-all placeholder:text-[#91a9ca] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Company</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Muhammad Ahmed Company? ?? ????Muhammad Ahmed Muhammad Ahmed???..."
                  className="w-full resize-none rounded-xl border border-border bg-white/5 px-4 py-3 text-white transition-all placeholder:text-[#91a9ca] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sci-fi-button flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition-all disabled:opacity-50 hover:bg-primary/90"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Muhammad Ahmed???..." : "Full name?"}
                </button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <button type="button" className="sci-fi-button flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition-all hover:bg-green-600 sm:w-auto">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                </a>
                <a href={emailLink}>
                  <button type="button" className="sci-fi-button flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border px-5 py-3 font-semibold text-white transition-all hover:border-primary hover:text-primary sm:w-auto">
                    <Mail className="h-4 w-4" />
                    Company
                  </button>
                </a>
              </div>
            </form>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <h4 className="mb-6 text-center text-lg font-bold text-foreground">?Message sent successfully??</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group flex items-center gap-3 rounded-xl p-4 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold text-foreground">{WHATSAPP_NUMBER}</p>
                </div>
              </a>
              <a href={emailLink} className="surface-card group flex items-center gap-3 rounded-xl p-4 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">?Full name????</p>
                  <p className="text-sm font-semibold text-foreground">{EMAIL}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <MotionReveal key={faq.q} variant="scale-in" delay={i * 0.06}>
                <FaqItem question={faq.q} answer={faq.a} />
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 pb-8 pt-2">
        <div className="container hud-panel flex flex-col items-center justify-between gap-4 rounded-[1.6rem] border-white/12 px-6 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">� 2026 Muhammad. All rights reserved.</p>
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            ?Full name??
          </a>
        </div>
      </footer>
    </div>
  );
}

