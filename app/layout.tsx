import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";

import { inter, sourceSerif } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://obsidian-delta-kohl.vercel.app"),

  title: {
    template: "%s | Biblioteca Obsidian",
    default: "Biblioteca Obsidian | Sistema de Gestión Bibliotecaria",
  },

  description:
    "Plataforma de gestión bibliotecaria para explorar libros, administrar préstamos, reservas, reseñas, listas de deseos y suscripciones.",

  applicationName: "Biblioteca Obsidian",

  keywords: [
    "biblioteca digital",
    "gestión bibliotecaria",
    "libros",
    "préstamos",
    "reservas",
    "reseñas",
    "suscripciones",
  ],

  authors: [{ name: "Gerardo Martínez Monge", url: "https://www.gerardomartinez.dev" }],
  creator: "Gerardo Martínez Monge",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "https://obsidian-delta-kohl.vercel.app",
    siteName: "Biblioteca Obsidian",
    title: "Biblioteca Obsidian | Sistema de Gestión Bibliotecaria",
    description:
      "Explora el catálogo, administra préstamos y reservas, publica reseñas y gestiona tu experiencia dentro de la biblioteca.",
    images: [
      {
        url: "/icon1.png",
        width: 1200,
        height: 630,
        alt: "Biblioteca Obsidian",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Biblioteca Obsidian | Sistema de Gestión Bibliotecaria",
    description:
      "Explora libros, préstamos, reservas, reseñas y suscripciones desde una plataforma bibliotecaria moderna.",
    images: ["/icon1.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("library-theme")?.value ?? "light";

  return (
    <html lang="es" data-scroll-behavior="smooth" className={theme === "dark" ? "dark" : ""}>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`}>
        <ThemeProvider initialTheme={theme as "light" | "dark"}>
          <Providers>{children}</Providers>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
