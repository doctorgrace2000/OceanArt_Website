import type { Metadata } from "next";
import CartView from "@/components/CartView";
import { asLocale, pick } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return { title: pick(locale, "Carrito", "Cart"), robots: { index: false } };
}

export default function CarritoPage() {
  return <CartView />;
}
