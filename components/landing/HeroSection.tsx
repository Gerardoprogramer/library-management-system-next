import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRight,
  PiBookOpenText,
  PiBooks,
  PiBookmarkSimple,
  PiCheckCircle,
  PiClock,
  PiMagnifyingGlass,
  PiSparkle,
  PiTrendUp,
} from "react-icons/pi";
import type { ElementType } from "react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_26%,color-mix(in_oklab,var(--primary)_13%,transparent),transparent_32rem)]" />
        <div className="absolute -left-40 bottom-0 size-120 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
      </div>

      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <PiSparkle className="size-4" />
            Tu espacio para leer mejor
          </div>

          <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">
            Encontrá tu próxima
            <span className="block text-primary">gran historia.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Descubrí libros, reservá ejemplares y seguí tus préstamos desde un solo lugar. Una biblioteca más simple para que te concentres en leer.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-5 shadow-lg shadow-primary/20">
              <Link href="/auth/register">
                Empezar a explorar
                <PiArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-5 bg-card/60">
              <Link href="/auth/login">Ya tengo una cuenta</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><PiCheckCircle className="size-4 text-primary" />Catálogo actualizado</span>
            <span className="inline-flex items-center gap-2"><PiCheckCircle className="size-4 text-primary" />Reservas sin complicaciones</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mt-4">
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
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Biblioteca Obsidian</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">¿Qué querés leer hoy?</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                    <PiBookOpenText className="size-6 text-primary-foreground" />
                  </div>
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur-md">
                  <PiMagnifyingGlass className="size-5 text-white/60" />
                  <span className="text-sm text-white/60">Buscar por título, autor o género</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <PreviewStat icon={PiBooks} label="Libros en catálogo" value="2.480" />
                  <PreviewStat icon={PiBookmarkSimple} label="Reservas activas" value="12" />
                </div>

                <div className="mt-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tu actividad</span>
                    <span className="text-xs text-primary-foreground/70">Esta semana</span>
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
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"><PiTrendUp className="size-5" /></span>
              <div><p className="text-xs text-muted-foreground">Lecturas organizadas</p><p className="text-sm font-semibold">Todo bajo control</p></div>
            </div>

            <div className="absolute -right-3 -top-5 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xl sm:-right-8">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><PiClock className="size-5" /></span>
              <div><p className="text-xs text-muted-foreground">Próximo vencimiento</p><p className="text-sm font-semibold">En 5 días</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const PreviewStat = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) => (
  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
    <Icon className="size-5 text-primary" />
    <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
    <p className="mt-1 text-xs text-white/55">{label}</p>
  </div>
);
