import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Container narrow className="py-28 text-center">
      <p className="font-hand text-2xl text-sea">ups</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-navy">Esta página no existe</h1>
      <p className="mt-3 text-ink/80">Quizás la obra se vendió o el enlace cambió.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/tienda">ver la tienda</Button>
        <Button href="/" variant="outline">ir al inicio</Button>
      </div>
    </Container>
  );
}
