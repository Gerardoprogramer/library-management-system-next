import Image from "next/image";
import Link from "next/link";
import { PiArrowRight, PiBooks, PiCheckCircle, PiSparkle } from "react-icons/pi";
import type { ElementType } from "react";

import { Button } from "@/components/ui/button";
import heroImage from "@/public/library-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Biblioteca con estanterías llenas de libros"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-background/85 dark:bg-background/88" />

        <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/60" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PiSparkle className="size-4" />
            </div>

            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sistema de gestión bibliotecaria
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tu biblioteca,
            <span className="text-primary"> organizada y accesible</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Explorá el catálogo, gestioná préstamos, reservas, reseñas, suscripciones y pagos desde una sola plataforma.
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
        </div>
      </div>
    </section>
  );
};

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
