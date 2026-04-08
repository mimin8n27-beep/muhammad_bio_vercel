import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/contact";
import { CheckCircle2, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ContactFormPremiumProps {
  whatsappNumber: string;
  email: string;
  source?: string;
}

const initialState = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export default function ContactFormPremium({
  whatsappNumber,
  email,
  source = "website",
}: ContactFormPremiumProps) {
  const [formData, setFormData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await submitContactForm({ ...formData, source });
      setSubmitted(true);
      setFormData(initialState);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "تعذر إرسال الرسالة حالياً. حاول مرة أخرى بعد قليل.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    `مرحباً محمد، أنا ${formData.name || "عميل جديد"} وأريد تنفيذ نظام أوتوميشن مناسب لشغلي.`,
  )}`;

  const emailLink = `mailto:${email}?subject=Automation system inquiry`;

  return (
    <div className="surface-card surface-card-glow light-sweep mx-auto max-w-6xl p-7 md:p-10 lg:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <div>
          <span className="section-eyebrow">Automation intake</span>
          <h3 className="mb-4 text-4xl font-bold leading-[1.02] text-white md:text-5xl">احكي لي أين يتعطل الشغل وسأحوّله إلى أوتوميشن أوضح وأسرع</h3>
          <p className="mb-7 max-w-xl text-[1.04rem] leading-8 text-[#c8ddf0]">
            اكتب لي الخطوات الحالية، الأدوات التي تعمل عليها، وأين يضيع الوقت بين المهام اليدوية.
            سواء كنت تحتاج n8n workflows، integrations بين الأنظمة، أو automation layer مدعوم بالـ AI، سنبني الحل بشكل مرتب واحترافي.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card light-sweep p-5"
            >
              <div className="mb-3 feature-icon">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="mb-1 font-semibold text-white">WhatsApp</p>
              <p className="text-sm text-[#d8ecff]">{whatsappNumber}</p>
            </a>

            <a href={emailLink} className="surface-card light-sweep p-5">
              <div className="mb-3 feature-icon">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mb-1 font-semibold text-white">البريد</p>
              <p className="text-sm text-[#d8ecff]">{email}</p>
            </a>
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2.5 text-sm text-[#d8ecff]">
            <ShieldCheck className="h-4 w-4 text-primary" />
            تواصل مباشر لمشاريع الأوتوميشن والـ integrations والـ AI workflows.
          </div>
        </div>

        <div className="relative z-20">
          {submitted ? (
            <div className="surface-card-glow flex min-h-[28rem] flex-col items-center justify-center rounded-[1.6rem] border border-primary/15 bg-primary/8 p-8 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
              <h4 className="mb-2 text-2xl font-bold">تم استلام طلبك</h4>
              <p className="max-w-sm text-muted-foreground">
                رسالتك وصلت بنجاح. سأراجع احتياجك وأرجع لك بأفضل خطوة مناسبة لمشروع الأوتوميشن.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-20 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#dcecff]">الاسم</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="اكتب اسمك"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#dcecff]">البريد الإلكتروني</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#dcecff]">الشركة أو النشاط</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="اختياري"
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#dcecff]">ما الذي تريد أن يحسّنه الأوتوميشن؟</label>
                <div className="field-shell">
                  <textarea
                    className="field-input min-h-36 resize-none"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="اشرح العملية الحالية، الأدوات المستخدمة، وما النتيجة التي تريد الوصول لها بعد الأوتوميشن."
                    required
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="sci-fi-button mt-2 h-12 rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(31,122,255,0.35)] hover:bg-primary/90"
              >
                {isSubmitting ? "جارٍ الإرسال..." : "أرسل طلب المشروع"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
