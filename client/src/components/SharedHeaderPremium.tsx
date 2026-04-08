import { Menu, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
];

export default function SharedHeaderPremium() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const goHome = () => {
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLocation("/");
  };

  const goToContact = () => {
    if (location === "/") {
      document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLocation("/?scroll=contact");
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto max-w-7xl rounded-[1.4rem] border px-4 py-3 transition-all duration-300 md:px-6 ${
          scrolled
            ? "border-white/30 bg-white/72 shadow-[0_20px_60px_rgba(10,28,59,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#09101d]/78"
            : "border-white/20 bg-white/52 backdrop-blur-xl dark:border-white/8 dark:bg-[#09101d]/56"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <button onClick={goHome} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#246bff,#7bf1d3)] text-sm font-bold text-[#08111f] shadow-[0_12px_28px_rgba(36,107,255,0.28)]">
              M
            </div>
            <div>
              <p className="font-[var(--font-family-heading)] text-lg font-bold">Muhammad Bio</p>
              <p className="text-xs text-muted-foreground">Premium automation systems</p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => {
              const active = location === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <button
              onClick={goToContact}
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" />
              Let's Talk
            </button>
          </nav>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/50 text-foreground md:hidden dark:bg-white/5"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 grid gap-2 border-t border-white/15 pt-4 md:hidden">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/8"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={goToContact}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Contact
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
