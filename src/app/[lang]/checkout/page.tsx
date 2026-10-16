import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { Container } from "@/components/ui/Section";
import { asLocale, pick } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  return { title: pick(locale, "Finalizar compra", "Checkout"), robots: { index: false } };
}

export default async function CheckoutPage({ params }: Props) {
  const locale = asLocale((await params).lang);
  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-navy">
        {pick(locale, "Finalizar compra", "Checkout")}
      </h1>
      <p className="mt-2 text-stone">
        {pick(
          locale,
          "Completá tus datos. En el siguiente paso te mostramos los datos para transferir.",
          "Enter your details. Prices are in US dollars; we'll contact you to arrange payment and shipping.",
        )}
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </Container>
  );
}
