import type { Metadata } from "next";
import OrderConfirmation from "@/components/OrderConfirmation";
import { Container } from "@/components/ui/Section";
import { asLocale, pick } from "@/i18n/config";

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return { title: pick(locale, "Tu pedido", "Your order"), robots: { index: false } };
}

export default async function PedidoPage({ params }: Props) {
  const { id } = await params;
  return (
    <Container className="py-10 md:py-14">
      <OrderConfirmation id={id} />
    </Container>
  );
}
