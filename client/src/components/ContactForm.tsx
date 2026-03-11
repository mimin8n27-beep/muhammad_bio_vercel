import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MessageCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ContactFormProps {
  whatsappNumber: string;
  email: string;
}

export default function ContactForm({ whatsappNumber, email }: ContactFormProps) {
  const { t, dir } = useLanguage();
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
      const { error: supabaseError } = await supabase.from("messages").insert([{
        name: formData.name, email: formData.email, company: formData.company, message: formData.message,
      }]);
      if (supabaseError) throw supabaseError;
      setSubmitted(true);
      setTimeout(() => { setFormData({ name: "", email: "", company: "", message: "" }); setSubmitted(false); }, 3000);
    } catch {
      setError(t("contact.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const emailLink = `mailto:${email}`;

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4"><CheckCircle className="w-16 h-16 text-primary animate-bounce" /></div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{t("contact.success.title")}</h3>
        <p className="text-muted-foreground">{t("contact.success.desc")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" dir={dir}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">{t("contact.name")}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t("contact.namePlaceholder")} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">{t("contact.email")}</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-foreground mb-2">{t("contact.company")}</label>
          <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder={t("contact.companyPlaceholder")} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">{t("contact.message")}</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder={t("contact.messagePlaceholder")} rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2">
            {isSubmitting ? t("contact.sending") : t("contact.send")}
          </Button>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button type="button" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
          </a>
          <a href={emailLink}>
            <Button type="button" variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-secondary gap-2">
              <Mail className="w-4 h-4" /> {t("contact.emailLabel")}
            </Button>
          </a>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-border">
        <h4 className="text-lg font-bold text-foreground mb-6 text-center">{t("contact.quickTitle")}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all flex items-center gap-3 group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="font-semibold text-foreground">{whatsappNumber}</p>
            </div>
          </a>
          <a href={emailLink} className="p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("contact.emailLabel")}</p>
              <p className="font-semibold text-foreground text-sm">{email}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
