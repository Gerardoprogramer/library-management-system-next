import type { Metadata } from "next";
import { cinzel, cormorant } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.className} ${cormorant.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
