import { cn } from "@/lib/utils";

interface SceneBackdropProps {
  className?: string;
  intensity?: "medium" | "high";
}

export function SceneBackdrop({
  className,
  intensity = "high",
}: SceneBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "scene-backdrop",
        intensity === "high" ? "scene-backdrop-high" : "scene-backdrop-medium",
        className,
      )}
    >
      <span className="scene-orb scene-orb-a" />
      <span className="scene-orb scene-orb-b" />
      <span className="scene-orb scene-orb-c" />
      <span className="scene-grid" />
      <span className="scene-beam scene-beam-a" />
      <span className="scene-beam scene-beam-b" />
      <span className="scene-scanline" />
      <span className="scene-noise" />
      <span className="scene-particles scene-particles-a" />
      <span className="scene-particles scene-particles-b" />
      <span className="scene-hud scene-hud-left">
        <i />
        <i />
        <i />
      </span>
      <span className="scene-hud scene-hud-right">
        <i />
        <i />
      </span>
    </div>
  );
}
