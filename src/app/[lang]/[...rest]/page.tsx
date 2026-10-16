import { notFound } from "next/navigation";

// Cualquier dirección que no existe muestra el 404 con el diseño del sitio, en su idioma.
export default function CatchAll() {
  notFound();
}
