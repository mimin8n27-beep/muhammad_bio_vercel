import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function SurfaceCard({
  children,
  className,
  glow = false,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn("surface-card", glow && "surface-card-glow", className)}
      {...props}
    >
      {children}
    </div>
  );
}
