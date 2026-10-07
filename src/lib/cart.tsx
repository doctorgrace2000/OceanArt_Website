"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { getProduct, maxQty, type Product } from "@/data/products";

export interface CartLine {
  slug: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

interface State {
  lines: CartLine[];
  hydrated: boolean;
  lastAdded: { slug: string; at: number } | null;
}

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; slug: string; qty: number }
  | { type: "set"; slug: string; qty: number }
  | { type: "remove"; slug: string }
  | { type: "clear" }
  | { type: "dismiss" };

const STORAGE_KEY = "oceanart:cart:v1";

function clamp(slug: string, qty: number): number {
  const product = getProduct(slug);
  const max = product ? maxQty(product) : 1;
  return Math.max(1, Math.min(max, Math.floor(qty)));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.slug === action.slug);
      const lines = existing
        ? state.lines.map((l) =>
            l.slug === action.slug
              ? { ...l, qty: clamp(l.slug, l.qty + action.qty) }
              : l,
          )
        : [...state.lines, { slug: action.slug, qty: clamp(action.slug, action.qty) }];
      return { ...state, lines, lastAdded: { slug: action.slug, at: Date.now() } };
    }
    case "set":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.slug === action.slug ? { ...l, qty: clamp(l.slug, action.qty) } : l,
        ),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "clear":
      return { ...state, lines: [] };
    case "dismiss":
      return { ...state, lastAdded: null };
  }
}

interface CartContextValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  lastAdded: Product | null;
  add: (product: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    hydrated: false,
    lastAdded: null,
  });

  // Leer del navegador al montar.
  useEffect(() => {
    let lines: CartLine[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        lines = parsed.filter((l) => getProduct(l.slug)).map((l) => ({
          slug: l.slug,
          qty: clamp(l.slug, l.qty),
        }));
      }
    } catch {
      lines = [];
    }
    dispatch({ type: "hydrate", lines });
  }, []);

  // Persistir cambios.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines, state.hydrated]);

  // Ocultar el aviso "agregado" a los 4 s.
  useEffect(() => {
    if (!state.lastAdded) return;
    const t = window.setTimeout(() => dispatch({ type: "dismiss" }), 4000);
    return () => window.clearTimeout(t);
  }, [state.lastAdded]);

  const lines = useMemo<ResolvedLine[]>(
    () =>
      state.lines.flatMap((l) => {
        const product = getProduct(l.slug);
        if (!product || product.price === null) return [];
        return [{ ...l, product, lineTotal: product.price * l.qty }];
      }),
    [state.lines],
  );

  const add = useCallback(
    (product: Product, qty = 1) => dispatch({ type: "add", slug: product.slug, qty }),
    [],
  );
  const setQty = useCallback(
    (slug: string, qty: number) => dispatch({ type: "set", slug, qty }),
    [],
  );
  const remove = useCallback((slug: string) => dispatch({ type: "remove", slug }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const dismissToast = useCallback(() => dispatch({ type: "dismiss" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      hydrated: state.hydrated,
      lastAdded: state.lastAdded ? (getProduct(state.lastAdded.slug) ?? null) : null,
      add,
      setQty,
      remove,
      clear,
      dismissToast,
    }),
    [lines, state.hydrated, state.lastAdded, add, setQty, remove, clear, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
