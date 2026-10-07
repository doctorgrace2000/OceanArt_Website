import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "whatsapp" | "light" | "lightOutline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-dark shadow-sm shadow-navy/20 disabled:bg-stone/40 disabled:shadow-none",
  outline:
    "border border-navy text-navy hover:bg-navy hover:text-white disabled:border-stone/40 disabled:text-stone/60 disabled:hover:bg-transparent",
  ghost: "text-navy hover:bg-mist",
  whatsapp: "bg-whatsapp text-white hover:brightness-95 shadow-sm shadow-whatsapp/30",
  // Para usar sobre fotos (hero): blanco sólido y blanco translúcido con borde
  light: "bg-white text-navy hover:bg-foam shadow-lg shadow-navy/25",
  lightOutline:
    "border-2 border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-navy shadow-lg shadow-navy/20",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-[15px]",
  lg: "px-8 py-3.5 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-wide transition disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

type NativeProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export default function Button(props: LinkProps | NativeProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const cls = buttonClass(variant, size, className);

  if (props.href !== undefined) {
    const { href, external } = props;
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  const OWN_KEYS = new Set(["variant", "size", "className", "children", "href", "external"]);
  const rest = Object.fromEntries(
    Object.entries(props).filter(([k]) => !OWN_KEYS.has(k)),
  ) as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
