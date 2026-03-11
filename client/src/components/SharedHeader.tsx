import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SharedHeader() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = () => {
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/");
    }
  };

  const handleContactClick = () => {
    if (location === "/") {
      const el = document.getElementById("contact-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation("/?scroll=contact");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-border"
      style={{ boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none", transition: "box-shadow 0.2s" }}
    >
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-bold text-foreground">Muhammad</span>
        </button>

        {/* Nav + Lang Toggle */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 items-center" dir={lang === "ar" ? "rtl" : "ltr"}>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.home")}
            </a>
            <a href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.portfolio")}
            </a>
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.pricing")}
            </a>
            <button
              onClick={handleContactClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.contact")}
            </button>
          </nav>

          {/* Language Toggle */}
          <div className="flex items-center bg-secondary rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setLang("ar")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                lang === "ar"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                lang === "en"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
