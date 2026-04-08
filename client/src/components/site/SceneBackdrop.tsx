import { cn } from "@/lib/utils";

interface SceneBackdropProps {
  className?: string;
  intensity?: "medium" | "high";
}

export function SceneBackdrop({
  className,
  intensity = "high",
}: SceneBackdropProps) {
  const isHigh = intensity === "high";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "scene-backdrop",
        isHigh ? "scene-backdrop-high" : "scene-backdrop-medium",
        className,
      )}
    >
      <span className="scene-deep-space" />
      <span className="scene-nebula scene-nebula-a" />
      <span className="scene-nebula scene-nebula-b" />
      <span className="scene-starfield scene-starfield-far" />
      <span className="scene-starfield scene-starfield-mid" />
      <span className="scene-starfield scene-starfield-near" />
      {isHigh ? <span className="scene-meteor scene-meteor-a" /> : null}
      <span className="scene-orb scene-orb-a" />
      <span className="scene-orb scene-orb-b" />
      <span className="scene-orb scene-orb-c" />
      <span className="scene-grid" />
      {isHigh ? <span className="scene-beam scene-beam-a" /> : null}
      <span className="scene-particles scene-particles-a" />
      {isHigh ? <span className="scene-particles scene-particles-b" /> : null}
      {isHigh ? (
        <span className="scene-hud scene-hud-left">
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {isHigh ? (
        <span className="scene-hud scene-hud-right">
          <i />
          <i />
        </span>
      ) : null}
    </div>
  );
}
