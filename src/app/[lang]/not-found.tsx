"use client";

import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Container narrow className="py-28 text-center">
      <p className="font-hand text-2xl text-sea">{t("Ups", "Oops")}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-navy">
        {t("Esta página no existe", "This page doesn't exist")}
      </h1>
      <p className="mt-3 text-ink/80">
        {t("Quizás la obra se vendió o el enlace cambió.", "Maybe the piece was sold or the link changed.")}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/tienda">{t("Ver la tienda", "Visit the shop")}</Button>
        <Button href="/" variant="outline">{t("Ir al inicio", "Go home")}</Button>
      </div>
    </Container>
  );
}
