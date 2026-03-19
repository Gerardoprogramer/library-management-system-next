import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";

import { cinzel, cormorant } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";


export const metadata: Metadata = {
  metadataBase: new URL("https://obsidian-delta-kohl.vercel.app"),

  title: {
    template: "%s | Biblioteca Obsidian",
    default: "Biblioteca Obsidian | Gestión de conocimiento y notas interconectadas",
  },

  description:
    "Biblioteca digital para organizar conocimiento, notas interconectadas y construir tu segundo cerebro usando metodologías inspiradas en Obsidian.",

  applicationName: "Biblioteca Obsidian",

  keywords: [
    "obsidian",
    "obsidian notes",
    "personal knowledge management",
    "pkm",
    "second brain",
    "gestión del conocimiento",
    "biblioteca digital",
    "notas markdown",
    "organización de ideas",
    "productividad personal"
  ],

  authors: [{ name: "Gerardo Martinez Monge", url: "https://gerardodev.vercel.app" }],

  creator: "Gerardo Martinez Monge",
  publisher: "Biblioteca Obsidian",

  category: "technology",

  alternates: {
    canonical: "https://obsidian-delta-kohl.vercel.app",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "es",
    url: "https://obsidian-delta-kohl.vercel.app",
    siteName: "Biblioteca Obsidian",
    title: "Biblioteca Obsidian | Gestión de conocimiento digital",
    description:
      "Explora una biblioteca digital para organizar notas, ideas y conocimiento interconectado inspirada en Obsidian.",
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
    title: "Biblioteca Obsidian | Segundo cerebro digital",
    description:
      "Organiza tu conocimiento, ideas y notas interconectadas con un sistema inspirado en Obsidian.",
    images: ["/icon1.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("library-theme")?.value ?? "light";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className={`${cinzel.className} ${cormorant.className} antialiased`}>
        <ThemeProvider initialTheme={theme as "light" | "dark"}>
          <Providers>
            {children}
          </Providers>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}