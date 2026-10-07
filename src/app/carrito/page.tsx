import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false },
};

export default function CarritoPage() {
  return <CartView />;
}
