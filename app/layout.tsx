import type { Metadata } from "next";
import { cookies } from "next/headers";

import { cinzel, cormorant } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    template: '%s | Biblioteca Obsidian',
    default: 'Biblioteca Obsidian',
  },
  description: 'Biblioteca digital basada en el conocimiento y la organización de Obsidian.',
  icons: {
    icon: '/vercel.svg',
  },
  openGraph: {
    title: 'Biblioteca Obsidian',
    description: 'Biblioteca digital basada en el conocimiento y la organización de Obsidian.',
    images: ['/vercel.svg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("library-theme")?.value ?? "light";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body
        className={`${cinzel.className} ${cormorant.className} antialiased`}
      >
        <ThemeProvider initialTheme={theme as "light" | "dark"}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
