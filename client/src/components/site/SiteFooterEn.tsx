import { ArrowUpRight, Sparkles } from "lucide-react";

interface SiteFooterEnProps {
  homeHref?: string;
  homeLabel?: string;
  note?: string;
}

export function SiteFooterEn({
  homeHref = "/",
  homeLabel = "Back to home",
  note = "Premium automation systems built to reduce manual work and connect operations with clarity.",
}: SiteFooterEnProps) {
  return (
    <footer className="site-footer-shell px-4 pb-8 pt-8">
      <div className="container">
        <div className="site-footer">
          <div className="site-footer-copy">
            <span className="site-footer-badge">
              <Sparkles className="h-4 w-4" />
              Automation studio
            </span>
            <div>
              <p className="font-[var(--font-family-heading)] text-xl font-bold text-white">
                Muhammad Bio
              </p>
              <p className="max-w-xl text-sm leading-7 text-white/58">{note}</p>
            </div>
          </div>

          <div className="site-footer-meta">
            <p className="text-sm text-white/42">Copyright 2026 Muhammad Bio. All rights reserved.</p>
            <a href={homeHref} className="site-footer-link">
              {homeLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
