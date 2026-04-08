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
          : "Unable to send your message right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello Muhammad, I'm ${formData.name || "a new client"} and I'd like to discuss an automation project.`,
  )}`;

  const emailLink = `mailto:${email}?subject=Automation project inquiry`;

  return (
    <div className="surface-card mx-auto max-w-5xl p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="section-eyebrow">Secure outreach</span>
          <h3 className="mb-3 text-3xl font-bold">Tell me what needs to become smoother</h3>
          <p className="mb-6 max-w-xl text-muted-foreground">
            Share your workflow, the tools involved, and the bottlenecks you want to remove.
            The form uses stricter validation, a hidden bot trap, and a small submit cooldown.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card p-4"
            >
              <div className="mb-3 feature-icon">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="mb-1 font-semibold">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{whatsappNumber}</p>
            </a>

            <a href={emailLink} className="surface-card p-4">
              <div className="mb-3 feature-icon">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mb-1 font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </a>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Built with lighter anti-spam protection and safer handling.
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="surface-card-glow flex min-h-[28rem] flex-col items-center justify-center rounded-[1.6rem] border border-primary/15 bg-primary/8 p-8 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
              <h4 className="mb-2 text-2xl font-bold">Message received</h4>
              <p className="max-w-sm text-muted-foreground">
                Your note reached the inbox safely. I&apos;ll get back to you soon with the next best step.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Full name</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Muhammad Ahmed"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Company</label>
                <div className="field-shell">
                  <input
                    className="field-input"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Optional"
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
                <label className="mb-2 block text-sm font-semibold">What should this automation improve?</label>
                <div className="field-shell">
                  <textarea
                    className="field-input min-h-36 resize-none"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the process, the tools involved, and what success looks like."
                    required
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Sending..." : "Send secure inquiry"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
