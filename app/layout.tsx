import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tio da Van - Gestão Inteligente",
  description: "Gerenciamento eficiente e moderno de tarefas, rotas e logística.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-body antialiased min-h-[100dvh] w-full selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
