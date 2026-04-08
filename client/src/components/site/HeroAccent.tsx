interface HeroAccentProps {
  intensity?: "medium" | "high";
}

export function HeroAccent({ intensity = "high" }: HeroAccentProps) {
  return (
    <div
      aria-hidden="true"
      className={`hero-accent ${intensity === "high" ? "hero-accent-intense" : "hero-accent-medium"}`}
    >
      <div className="hero-accent-blob hero-accent-blob-primary" />
      <div className="hero-accent-blob hero-accent-blob-secondary" />
      <div className="hero-accent-ring hero-accent-ring-primary" />
      <div className="hero-accent-ring hero-accent-ring-secondary" />
      <div className="hero-accent-grid" />
      <div className="hero-accent-beam" />
      <div className="hero-accent-beam hero-accent-beam-secondary" />
      <div className="hero-accent-scanline" />
      <div className="hero-accent-hud hero-accent-hud-left">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-accent-hud hero-accent-hud-right">
        <span />
        <span />
      </div>
      <div className="hero-accent-noise" />
    </div>
  );
}
