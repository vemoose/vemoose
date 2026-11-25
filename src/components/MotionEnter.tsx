import type { CSSProperties, ReactNode } from "react";

type MotionEnterProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "hero";
};

export function MotionEnter({
  children,
  className = "",
  delay = 0,
  variant = "default",
}: MotionEnterProps) {
  const style = { "--enter-delay": `${delay}ms` } as CSSProperties;
  const motionClass = variant === "hero" ? "motion-enter-hero" : "motion-enter";

  return (
    <div
      className={`${motionClass}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}