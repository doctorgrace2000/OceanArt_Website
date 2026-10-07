import type { Metadata } from "next";
import OrderConfirmation from "@/components/OrderConfirmation";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false },
};

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Container className="py-10 md:py-14">
      <OrderConfirmation id={id} />
    </Container>
  );
}
