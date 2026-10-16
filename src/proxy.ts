import { NextResponse, type NextRequest } from "next/server";

/**
 * Idiomas por URL: el inglés vive en /en/…; todo lo demás es español y se sirve
 * internamente desde /es/… sin cambiar la dirección que ve la persona.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  // /es/tienda → /tienda (una sola dirección por página)
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Fuera: API, archivos internos de Next, imágenes y cualquier archivo con extensión
  matcher: ["/((?!api|_next|img|obras|.*\\..*).*)"],
};
