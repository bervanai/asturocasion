import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Astur Ocasión | Coches de Ocasión en Asturias",
  description:
    "Compra y vende coches de ocasión en Asturias. Amplio catálogo de vehículos revisados con garantía.",
  keywords: "coches ocasión, segunda mano, Asturias, concesionario",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
