import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function SharedHeader() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

        {/* Nav */}
        <nav className="hidden md:flex gap-8 items-center" dir="rtl">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            الرئيسية
          </a>
          <a href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            معرض الأعمال
          </a>
          <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            خطط التسعير
          </a>
          <button
            onClick={handleContactClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            تواصل معي
          </button>
        </nav>
      </div>
    </header>
  );
}
