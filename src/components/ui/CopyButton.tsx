"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/Icons";

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard bloqueado: el usuario puede seleccionar el texto */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar ${label}`}
      className="inline-flex items-center gap-1 rounded-pill border border-foam px-2.5 py-1 text-xs text-navy transition hover:bg-mist"
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      {copied ? "copiado" : "copiar"}
    </button>
  );
}
