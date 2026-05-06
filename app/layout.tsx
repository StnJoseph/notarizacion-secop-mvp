import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal de Verificación SECOP II",
  description: "Sistema de verificación de integridad para contratos públicos colombianos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}