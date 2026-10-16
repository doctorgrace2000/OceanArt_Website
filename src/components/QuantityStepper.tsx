"use client";

import { MinusIcon, PlusIcon } from "@/components/Icons";
import { useI18n } from "@/i18n/client";

export default function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  size = "md",
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-pill border border-foam">
      <button
        type="button"
        aria-label={t("Quitar uno", "Remove one")}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`${btn} flex items-center justify-center text-navy disabled:opacity-30`}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={t("Agregar uno", "Add one")}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={`${btn} flex items-center justify-center text-navy disabled:opacity-30`}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
