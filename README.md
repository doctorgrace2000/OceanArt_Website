# Ocean Art · tienda online

Sitio + ecommerce de [Ocean Art](https://oceanartveronicaorlando.myportfolio.com/) reconstruido en
**Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, pensado para desplegarse 100 % en Vercel
sin base de datos ni servicios pagos.

## Qué incluye

| Ruta | Qué hace |
| --- | --- |
| `/` | Inicio: hero de agua, "Sobre Ocean Art", qué hacemos (con el dibujo a mano), carrusel de obras destacadas, el taller |
| `/tienda` | Grilla de obras con filtros por categoría y orden por precio / fecha |
| `/tienda/[slug]` | Ficha de obra: galería, medidas, materiales, **añadir al carrito** (o "cotizar por WhatsApp" si no tiene precio) |
| `/carrito` | Carrito persistente en el navegador (localStorage), cantidades, subtotal |
| `/checkout` | Datos del cliente, retiro o envío, método de pago: **transferencia bancaria** |
| `/pedido/[id]` | Confirmación con CBU / alias (botones copiar), importe, y **botón que abre WhatsApp con el pedido ya escrito** para mandar el comprobante |
| `/disena-tu-obra` | Formulario de obra a medida que se envía por WhatsApp |
| `/info` | Verónica, el taller, contacto y preguntas frecuentes |
| `POST /api/orders` | Valida el pedido, recalcula precios desde el catálogo, genera el número `OA-…`, opcionalmente avisa por email |

## Correr en local

```bash
pnpm install
cp .env.example .env.local   # editá los datos bancarios y el WhatsApp
pnpm dev
```

## Editar el catálogo

Todo el catálogo vive en [`src/data/products.ts`](src/data/products.ts). Cada obra tiene:

- `price`: en pesos. Poné `null` para que en vez de "añadir al carrito" muestre "cotizar por WhatsApp".
- `availability`: `"unico"` (máximo 1 por carrito), `"a-pedido"` (hasta 10) o `"vendido"`.
- `images`: rutas dentro de `public/obras/<carpeta>/`. La primera es la portada.
- `featured`: `true` para que aparezca en el carrusel del inicio.

> **Los precios actuales son de ejemplo.** Reemplazalos por los reales antes de publicar.

Para agregar fotos nuevas: copiá los JPG a `public/obras/<slug>/` (ideal ≤ 1800 px de lado) y
sumalos al array `images`.

## Desplegar en Vercel

1. Subí el proyecto a un repo de GitHub / GitLab / Bitbucket.
2. En [vercel.com/new](https://vercel.com/new) importá el repo. Vercel detecta Next.js solo; no hay que tocar nada.
3. En **Settings → Environment Variables** cargá las variables de `.env.example`
   (como mínimo `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` y los `NEXT_PUBLIC_BANK_*`).
4. Deploy. Cada `git push` a `main` vuelve a desplegar.

O desde la terminal:

```bash
pnpm dlx vercel        # primer deploy (preview)
pnpm dlx vercel --prod # producción
```

### Aviso de pedidos al taller

- **Siempre**: el cliente ve los datos de transferencia y un botón que abre WhatsApp con el detalle
  del pedido. Es el canal principal.
- **Opcional, gratis**: si cargás `RESEND_API_KEY` y `ORDER_NOTIFY_EMAIL` en Vercel, cada pedido
  también llega por email ([resend.com](https://resend.com), 3.000 emails/mes gratis).
- Además cada pedido queda en los **logs de Vercel** (`[order] {...}`), consultables desde el dashboard.

### Próximos pasos posibles (sin salir de Vercel)

- Guardar pedidos en una base: Vercel Postgres / Neon o Upstash Redis (ambos con plan gratis).
- Panel de administración simple protegido con contraseña para marcar obras como vendidas.
- Pasarela con tarjeta (Mercado Pago Checkout Pro) si más adelante se quiere sumar a la transferencia.

## Stack

- Next.js 16 · React 19 · TypeScript estricto
- Tailwind CSS 4 (tokens de color en `src/app/globals.css`: `navy`, `ink`, `sand`, `mist`, `foam`, `sea`)
- Tipografías: Nunito Sans (texto) y Caveat (acentos manuscritos), vía `next/font`
- Sin dependencias externas de UI ni de estado
