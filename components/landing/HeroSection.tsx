import { BookOpen, Scroll, Globe, Sparkles } from "lucide-react";
import { Button } from '@/components/ui/button';
import heroImage from "@/public/library-hero.jpg";
import Image from "next/image";

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20">
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage}
                    alt="Biblioteca antigua con estanterías y libros históricos"
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/98 to-background/60 dark:from-background dark:via-background/95 dark:to-background/70" />
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container mx-auto px-6 lg:px-20 relative z-10">
                <div className="max-w-3xl">
                    {/* Decorative line */}
                    <div className="flex items-center gap-4 mb-8 animate-fade-in">
                        <div className="h-px w-12 bg-primary" />
                        <span className="font-display text-xs tracking-[0.4em] uppercase text-primary">
                            Est. MMXXVI
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="font-display text-4xl sm:text-5xl lg:text-7xl font-semibold text-foreground leading-[1.1] mb-8 animate-fade-in tracking-wide"
                        style={{ animationDelay: "0.1s" }}
                    >
                        Donde la
                        <br />
                        <span className="text-gradient">Sabiduría</span> Antigua
                        <br />
                        se Encuentra con lo Moderno
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="font-body text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-xl animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Descubre siglos de conocimiento. Desde manuscritos raros hasta obras contemporáneas,
                        tu viaje por la historia empieza aquí.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-wrap gap-4 mb-12 animate-fade-in"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <Button size="lg" className="px-8 font-display tracking-wider uppercase text-sm">
                            Comenzar Ahora
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 font-display tracking-wider uppercase text-sm">
                            Ya tengo cuenta
                        </Button>
                    </div>

                    {/* Stats */}
                    <div
                        className="flex flex-wrap gap-8 sm:gap-12 animate-fade-in"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="font-display text-2xl font-semibold text-foreground">127K</span>
                                <p className="font-body text-sm text-muted-foreground">Volúmenes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Scroll className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="font-display text-2xl font-semibold text-foreground">2,400+</span>
                                <p className="font-body text-sm text-muted-foreground">Manuscritos Raros</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="font-display text-2xl font-semibold text-foreground">50+</span>
                                <p className="font-body text-sm text-muted-foreground">Idiomas</p>
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    <div
                        className="mt-16 flex items-center gap-3 animate-fade-in"
                        style={{ animationDelay: "0.5s" }}
                    >
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="font-body text-sm text-muted-foreground italic">
                            "El conocimiento es el tesoro de un hombre sabio."
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
