import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";

import { cinzel, cormorant } from "@/app/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://obsidian-delta-kohl.vercel.app'),
  title: {
    template: '%s | Biblioteca Obsidian',
    default: 'Biblioteca Obsidian',
  },
  description: 'Biblioteca digital basada en el conocimiento y la organización de Obsidian.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Biblioteca Obsidian',
    description: 'Biblioteca digital basada en el conocimiento y la organización de Obsidian.',
    images: ['/favicon.ico'],
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