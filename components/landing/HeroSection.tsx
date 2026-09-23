import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRight,
  PiBookOpenText,
  PiBooks,
  PiBookmarkSimple,
  PiCheckCircle,
  PiClock,
  PiCompass,
  PiMagnifyingGlass,
  PiNotebook,
  PiQuotes,
  PiTrendUp,
  PiUsersThree,
} from "react-icons/pi";
import type { ElementType } from "react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <main className="overflow-hidden pt-16">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,color-mix(in_oklab,var(--primary)_13%,transparent),transparent_34rem)]" />
          <div className="absolute -left-40 bottom-0 size-120 rounded-full bg-primary/8 blur-3xl" />
        </div>

        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8 lg:py-24">
          <div className="landing-reveal relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <PiBooks className="size-4" />
              Biblioteca Obsidian
            </div>
            <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">
              Una biblioteca que
              <span className="block text-primary">te acompaña.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Biblioteca Obsidian reúne el catálogo, tus préstamos, reservas y reseñas en un solo espacio. Encuentra
              libros, sigue tu actividad y vuelve siempre a la próxima lectura.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-5 shadow-lg shadow-primary/20">
                <Link href="/auth/register">
                  Conocer la biblioteca <PiArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-card/60 px-5">
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <PiCheckCircle className="size-4 text-primary" />
                Catálogo para explorar
              </span>
              <span className="inline-flex items-center gap-2">
                <PiCheckCircle className="size-4 text-primary" />
                Préstamos en un solo lugar
              </span>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section id="sobre-el-proyecto" className="border-y border-border/60 bg-muted/25">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow">Sobre el proyecto</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              Más que un catálogo: una experiencia completa de biblioteca.
            </h2>
          </div>
          <div className="grid gap-5 text-base leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              Biblioteca Obsidian nace para acercar la gestión bibliotecaria a las personas. El proyecto conecta lo que
              ocurre en una biblioteca física con una experiencia digital clara y fácil de usar.
            </p>
            <p>
              Desde una cuenta puedes descubrir títulos, consultar disponibilidad, reservar un ejemplar, revisar tus
              fechas de devolución y compartir tu opinión con otros lectores.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Del descubrimiento al préstamo, sin perderte.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Todo lo necesario para mantener tus lecturas ordenadas y aprovechar mejor cada visita a la biblioteca.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <FeatureStep
            number="01"
            icon={PiCompass}
            title="Descubre"
            text="Explora el catálogo por título, autor o género y encuentra libros que despierten tu interés."
          />
          <FeatureStep
            number="02"
            icon={PiBookmarkSimple}
            title="Reserva"
            text="Consulta la disponibilidad y reserva el ejemplar que quieres leer desde tu cuenta."
          />
          <FeatureStep
            number="03"
            icon={PiNotebook}
            title="Continúa"
            text="Sigue tus préstamos, fechas y reseñas para construir tu propio historial de lectura."
          />
        </div>
      </section>

      <section className="bg-[#201d1b] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Pensado para cada parte de la biblioteca
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
              Una herramienta para lectores y para quienes hacen posible la biblioteca.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-white/65">
              La plataforma reúne una experiencia sencilla para usuarios y un espacio de control para administrar
              libros, usuarios, préstamos, reservas, multas y suscripciones.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <AudienceCard
              icon={PiBookOpenText}
              title="Para lectores"
              text="Encuentra, reserva y organiza tus lecturas."
            />
            <AudienceCard
              icon={PiUsersThree}
              title="Para bibliotecarios"
              text="Administra el catálogo y las operaciones."
            />
            <AudienceCard icon={PiTrendUp} title="Seguimiento claro" text="Consulta actividad, estados y fechas." />
            <AudienceCard icon={PiQuotes} title="Comunidad" text="Comparte reseñas y recomendaciones." />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary/8" />
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
          <PiBooks className="size-10 text-primary" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">Tu próxima lectura empieza aquí.</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Crea tu cuenta y entra a una biblioteca diseñada para ayudarte a descubrir, reservar y disfrutar más libros.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-xl px-6">
            <Link href="/auth/register">
              Crear mi cuenta <PiArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

const ProductPreview = () => (
  <div className="landing-reveal-delayed relative mx-auto w-full max-w-xl lg:mt-4">
    <div className="absolute -inset-8 rounded-[3rem] bg-primary/12 blur-3xl" />
    <div className="relative rotate-1 rounded-[2rem] border border-border/70 bg-card/80 p-3 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-5">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-[#201d1b] p-5 text-white sm:p-7">
        <Image
          src="/library-hero.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 42vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#201d1b]/75 via-[#201d1b]/55 to-primary/35" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Tu biblioteca</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">Encuentra tu próxima lectura</p>
            </div>
            <PiBookOpenText className="size-7 text-primary" />
          </div>
          <div className="mt-7 flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 ring-1 ring-white/15">
            <PiMagnifyingGlass className="size-5 text-white/60" />
            <span className="text-sm text-white/60">Buscar por título, autor o género</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <PreviewStat icon={PiBooks} label="Libros en catálogo" value="2.480" />
            <PreviewStat icon={PiBookmarkSimple} label="Reservas activas" value="12" />
          </div>
          <div className="mt-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Tu actividad</span>
              <span className="text-xs text-white/55">Esta semana</span>
            </div>
            <div className="mt-5 flex items-end gap-2">
              {[34, 48, 40, 68, 54, 82, 62].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{ height: `${height}px` }} />
                  <span className="text-[10px] text-white/45">{"LMXJVSD"[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xl sm:-left-10">
        <PiTrendUp className="size-5 text-emerald-600" />
        <div>
          <p className="text-xs text-muted-foreground">Tus lecturas</p>
          <p className="text-sm font-semibold">Siempre organizadas</p>
        </div>
      </div>
      <div className="absolute -right-3 -top-5 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xl sm:-right-8">
        <PiClock className="size-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Próximo vencimiento</p>
          <p className="text-sm font-semibold">En 5 días</p>
        </div>
      </div>
    </div>
  </div>
);

const PreviewStat = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) => (
  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    <Icon className="size-5 text-primary" />
    <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
    <p className="mt-1 text-xs text-white/55">{label}</p>
  </div>
);
const FeatureStep = ({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: ElementType;
  title: string;
  text: string;
}) => (
  <article className="surface-muted relative p-6">
    <span className="text-xs font-semibold tracking-[0.18em] text-primary">{number}</span>
    <div className="mt-8 flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
      <Icon className="size-5" />
    </div>
    <h3 className="mt-5 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
  </article>
);
const AudienceCard = ({ icon: Icon, title, text }: { icon: ElementType; title: string; text: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
    <Icon className="size-6 text-primary" />
    <h3 className="mt-5 font-semibold">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
  </div>
);
