import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-navy">Finalizar compra</h1>
      <p className="mt-2 text-stone">
        Completá tus datos. En el siguiente paso te mostramos los datos para transferir.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </Container>
  );
}
