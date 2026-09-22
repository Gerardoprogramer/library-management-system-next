import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRight,
  PiBookOpenText,
  PiBooks,
  PiCheckCircle,
  PiClock,
  PiSparkle,
  PiTrendUp,
} from "react-icons/pi";
import type { ElementType } from "react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-dvh items-start overflow-hidden pt-16 lg:items-center">
      <div className="absolute inset-0">
        <Image
          src="/library-hero.jpg"
          alt="Biblioteca con estanterías llenas de libros"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-background/72 dark:bg-background/90" />

        <div className="absolute inset-0 bg-linear-to-r from-background via-background/88 to-background/42" />
        <div className="absolute -right-32 top-24 size-96 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
              <PiSparkle className="size-4" />
            </div>

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sistema de gestión bibliotecaria
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Tu biblioteca,
            <span className="text-primary"> organizada y accesible</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
            Encontrá tu próxima lectura, reservá ejemplares y llevá el control de tus préstamos sin vueltas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/register">
                Crear cuenta
                <PiArrowRight />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            <HeroFeature icon={PiBooks} text="Catálogo y disponibilidad" />

            <HeroFeature icon={PiCheckCircle} text="Préstamos y reservas" />

            <HeroFeature icon={PiSparkle} text="Reseñas y membresías" />
          </div>

          <div className="mt-8 flex max-w-xl items-center gap-4 rounded-2xl border border-primary/15 bg-card/75 p-4 shadow-lg shadow-primary/5 backdrop-blur-md">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PiBookOpenText className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Una experiencia pensada para leer más</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Descubre, reserva y organiza tus lecturas desde cualquier dispositivo.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <PiCheckCircle className="size-4 text-primary" />
              Acceso desde cualquier dispositivo
            </span>
            <span className="inline-flex items-center gap-2">
              <PiTrendUp className="size-4 text-primary" />
              Tu historial siempre organizado
            </span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-primary/10 blur-3xl" />
          <div className="surface relative overflow-hidden border-white/10 bg-card/85 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="rounded-2xl bg-muted/45 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Tu biblioteca</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">Todo en un solo lugar</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <PiBookOpenText className="size-6" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <PreviewStat icon={PiBooks} label="En catálogo" value="2,480" />
                <PreviewStat icon={PiClock} label="Préstamos activos" value="12" />
              </div>

              <div className="mt-3 rounded-2xl border border-border/70 bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Actividad reciente</span>
                  <span className="text-xs text-primary">Esta semana</span>
                </div>
                <div className="mt-5 flex items-end gap-2">
                  {[38, 52, 44, 70, 58, 84, 66].map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-primary/75" style={{ height: `${height}px` }} />
                      <span className="text-[10px] text-muted-foreground">
                        {["L", "M", "X", "J", "V", "S", "D"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PreviewStat = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) => (
  <div className="rounded-2xl border border-border/70 bg-card p-4">
    <Icon className="size-5 text-primary" />
    <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

interface HeroFeatureProps {
  icon: ElementType;
  text: string;
}

const HeroFeature = ({ icon: Icon, text }: HeroFeatureProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 p-3 backdrop-blur-sm">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <p className="text-sm font-medium text-foreground">{text}</p>
    </div>
  );
};
