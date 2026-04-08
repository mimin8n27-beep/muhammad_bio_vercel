import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

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
      <motion.div
        dir="ltr"
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-7xl rounded-[1.4rem] border px-4 py-3 transition-all duration-300 md:px-6 ${
          scrolled
            ? "hud-panel border-primary/25 bg-[rgba(4,11,24,0.86)] shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-2xl"
            : "border-white/10 bg-[rgba(6,14,27,0.56)] shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <button onClick={goHome} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#246bff,#7bf1d3)] text-sm font-bold text-[#08111f] shadow-[0_12px_28px_rgba(36,107,255,0.28)]">
              M
            </div>
            <div>
              <p className="font-[var(--font-family-heading)] text-lg font-bold text-white">Muhammad Bio</p>
              <p className="text-xs text-white/55">Cinematic automation systems</p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 md:flex" dir="ltr">
            {navigation.map((item) => {
              const active = location === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-white/62 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="header-nav-indicator"
                      className="absolute inset-x-0 -bottom-1 h-px bg-[linear-gradient(90deg,transparent,#6dffd3,transparent)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                </a>
              );
            })}
            <button
              onClick={goToContact}
              className="sci-fi-button inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/15 px-4 py-2 text-sm font-semibold text-[#c8eeff] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/25"
            >
              <Sparkles className="h-4 w-4" />
              Let's Talk
            </button>
          </nav>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-white md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1, height: "auto", marginTop: 16 }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hud-panel overflow-hidden rounded-[1.2rem] border-white/12 md:hidden"
            >
              <div className="grid gap-2 border-t border-white/10 p-3" dir="ltr">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-primary/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={goToContact}
                  className="sci-fi-button rounded-2xl bg-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
