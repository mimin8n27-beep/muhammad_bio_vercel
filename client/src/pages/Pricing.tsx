import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SharedHeader from "@/components/SharedHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, CheckCircle, Loader2, CheckCircle2, Mail, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+201061455162";
const EMAIL = "mimi.n8n27@gmail.com";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group
        ${open ? "border-primary shadow-sm shadow-primary/10" : "border-border hover:border-primary/40"}`}
    >
      <div className="flex items-center justify-between p-5 gap-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{question}</h3>
        <span className={`text-primary font-bold text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const { t, dir, lang } = useLanguage();
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
      setError(t("pricingPage.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
  const emailLink = `mailto:${EMAIL}`;

  const plans = [
    {
      name: "Small",
      desc: lang === "ar" ? "Workflow بسيط / Trigger + 1-2 nodes" : "Basic workflow / trigger + 1–2 nodes",
      hours: "4-8 hours",
      features: lang === "ar"
        ? ["Workflow أو Trigger أساسي", "1-2 automation nodes", "منطق بسيط"]
        : ["Basic workflow or trigger", "1–2 automation nodes", "Simple logic flow"],
      basePrice: "$150 – $400",
      premiumOptions: lang === "ar"
        ? [{ label: "توثيق PDF", price: "+$50" }, { label: "فيديو Demo", price: "+$100" }, { label: "دعم أسبوع", price: "+$50" }]
        : [{ label: "PDF Documentation", price: "+$50" }, { label: "Video Demo", price: "+$100" }, { label: "1 Week Support", price: "+$50" }],
      finalPrice: "$200 – $450",
      popular: false,
    },
    {
      name: "Medium",
      desc: lang === "ar" ? "Logic + Notifications + 3-5 nodes" : "Logic + Notifications + 3–5 nodes",
      hours: "8-15 hours",
      features: lang === "ar"
        ? ["Workflow logic وإشعارات", "3-5 automation nodes", "عمليات متعددة الخطوات", "معالجة أخطاء أساسية"]
        : ["Workflow logic & notifications", "3–5 automation nodes", "Multi-step processes", "Basic error handling"],
      basePrice: "$400 – $900",
      premiumOptions: lang === "ar"
        ? [{ label: "توثيق PDF", price: "+$50 – $100" }, { label: "فيديو Demo", price: "+$100 – $200" }, { label: "دعم أسبوعين", price: "+$80 – $150" }]
        : [{ label: "PDF Documentation", price: "+$50 – $100" }, { label: "Video Demo", price: "+$100 – $200" }, { label: "2 Weeks Support", price: "+$80 – $150" }],
      finalPrice: "$500 – $1,050",
      popular: true,
    },
    {
      name: "Large",
      desc: lang === "ar" ? "Workflow معقد + Error Handling + APIs" : "Complex workflow + Error Handling + APIs",
      hours: "15-30 hours",
      features: lang === "ar"
        ? ["Workflow logic معقد", "Error handling والتحقق", "API integrations", "تحويل البيانات", "مراقبة متقدمة"]
        : ["Complex workflow logic", "Error handling & validation", "API integrations", "Data transformation", "Advanced monitoring"],
      basePrice: "$900 – $2,500+",
      premiumOptions: lang === "ar"
        ? [{ label: "توثيق PDF", price: "+$100 – $150" }, { label: "فيديو Demo", price: "+$150 – $300" }, { label: "دعم 3 أسابيع", price: "+$100 – $200" }]
        : [{ label: "PDF Documentation", price: "+$100 – $150" }, { label: "Video Demo", price: "+$150 – $300" }, { label: "3 Weeks Support", price: "+$100 – $200" }],
      finalPrice: "$1,050 – $2,800+",
      popular: false,
    },
    {
      name: "Enterprise",
      desc: lang === "ar" ? "نظام كامل + Multi API + قابل للتوسع" : "Full System + Multi API + Scalable",
      hours: "30+ hours",
      features: lang === "ar"
        ? ["معمارية Automation كاملة", "APIs وتكاملات متعددة", "بنية تحتية قابلة للتوسع", "Workflows مخصصة", "دعم مخصص", "تحسين الأداء"]
        : ["Full automation architecture", "Multiple APIs & integrations", "Scalable infrastructure", "Custom workflows", "Dedicated support", "Performance optimization"],
      basePrice: "$2,500+",
      premiumOptions: lang === "ar"
        ? [{ label: "الباقة الكاملة (PDF + فيديو + دعم)", price: "+$250 – $600+" }]
        : [{ label: "Full Suite (Documentation + Demo + Support)", price: "+$250 – $600+" }],
      finalPrice: "$2,750+",
      popular: false,
    },
  ];

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground" dir={dir}>

      <SharedHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 text-center border-b border-border">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("pricingPage.title")}</h1>
          <p className="text-muted-foreground text-lg">{t("pricingPage.desc")}</p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border-2 flex flex-col transition-all duration-300 group
                  ${plan.popular
                    ? "border-primary shadow-2xl shadow-primary/15 bg-white"
                    : "border-border bg-white hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      {t("pricingPage.popular")}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>

                  <div className="mb-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      {lang === "ar" ? "الوقت التقديري" : "Estimated Time"}
                    </p>
                    <p className="text-xl font-bold text-foreground">{plan.hours}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                      {lang === "ar" ? "المميزات" : "Features"}
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      {t("pricingPage.basePrice")}
                    </p>
                    <p className="text-2xl font-bold text-primary">{plan.basePrice}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                      {t("pricingPage.premiumOptions")}
                    </p>
                    <ul className="space-y-1.5">
                      {plan.premiumOptions.map((opt, j) => (
                        <li key={j} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{opt.label}</span>
                          <span className="font-semibold text-foreground">{opt.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      {t("pricingPage.finalPrice")}
                    </p>
                    <p className="text-xl font-bold text-primary">{plan.finalPrice}</p>
                  </div>

                  <a
                    href="#contact-section"
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-center flex items-center justify-center gap-2
                      ${plan.popular
                        ? "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/30"
                        : "border-2 border-border text-foreground hover:border-primary hover:text-primary"}`}
                  >
                    {plan.popular ? t("pricingPage.getStarted") : t("pricingPage.learnMore")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-section" className="py-20 bg-[#f8faff] border-t border-border">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("pricingPage.contact.title")}
            </h2>
            <p className="text-muted-foreground">{t("pricingPage.contact.desc")}</p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">{t("contact.success.title")}</h3>
              <p className="text-muted-foreground">{t("contact.success.desc")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("pricingPage.name")}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  placeholder={t("pricingPage.namePlaceholder")}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("pricingPage.email")}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="your@gmail.com"
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("pricingPage.message")}</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}
                  placeholder={t("pricingPage.messagePlaceholder")}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSubmitting ? t("pricingPage.sending") : t("pricingPage.send")}
                </button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <button type="button" className="w-full sm:w-auto px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" /> {t("pricingPage.contact.whatsapp")}
                  </button>
                </a>
                <a href={emailLink}>
                  <button type="button" className="w-full sm:w-auto px-5 py-3 border-2 border-border text-foreground hover:border-primary hover:text-primary rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> {t("pricingPage.contact.email")}
                  </button>
                </a>
              </div>
            </form>
          )}

          {/* Quick Contact */}
          <div className="mt-12 pt-8 border-t border-border">
            <h4 className="text-lg font-bold text-foreground mb-6 text-center">{t("contact.quickTitle")}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="p-4 bg-white border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all flex items-center gap-3 group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold text-foreground">{WHATSAPP_NUMBER}</p>
                </div>
              </a>
              <a href={emailLink}
                className="p-4 bg-white border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all flex items-center gap-3 group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("pricingPage.contact.email")}</p>
                  <p className="font-semibold text-foreground text-sm">{EMAIL}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            {t("pricingPage.faq.title")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">{t("footer.rights")}</p>
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← {t("portfolioPage.back")}
          </a>
        </div>
      </footer>
    </div>
  );
}
