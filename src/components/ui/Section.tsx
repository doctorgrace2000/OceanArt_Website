import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  hand,
  className = "",
  align = "center",
}: {
  children: ReactNode;
  /** Texto en letra manuscrita, encima del título */
  hand?: string;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {hand && <p className="font-hand text-xl text-sea">{hand}</p>}
      <h2 className="text-2xl font-medium tracking-tight text-navy md:text-3xl">{children}</h2>
    </div>
  );
}
