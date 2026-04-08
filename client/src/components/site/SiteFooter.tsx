import { ArrowUpRight, Sparkles } from "lucide-react";

interface SiteFooterProps {
  homeHref?: string;
  homeLabel?: string;
  note?: string;
}

export function SiteFooter({
  homeHref = "/",
  homeLabel = "Back to top",
  note = "Cinematic automation systems with a stronger sci-fi pulse.",
}: SiteFooterProps) {
  return (
    <footer className="site-footer-shell px-4 pb-8 pt-8">
      <div className="container">
        <div className="site-footer">
          <div className="site-footer-copy">
            <span className="site-footer-badge">
              <Sparkles className="h-4 w-4" />
              Signal online
            </span>
            <div>
              <p className="font-[var(--font-family-heading)] text-xl font-bold text-white">
                Muhammad Bio
              </p>
              <p className="max-w-xl text-sm leading-7 text-white/58">{note}</p>
            </div>
          </div>

          <div className="site-footer-meta">
            <p className="text-sm text-white/42">© 2026 Muhammad Bio. All rights reserved.</p>
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
