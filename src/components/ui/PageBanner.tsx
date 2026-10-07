import Image from "next/image";

/** Banner de entrada de cada sección: foto de agua con el título centrado. */
export default function PageBanner({ title, image }: { title: string; image: string }) {
  return (
    <div className="relative flex h-48 w-full items-center justify-center md:h-64">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-navy/35" aria-hidden />
      <h1 className="relative px-4 text-center text-4xl font-medium tracking-tight text-white drop-shadow-[0_2px_12px_rgba(1,29,58,0.45)] md:text-5xl">
        {title}
      </h1>
    </div>
  );
}
