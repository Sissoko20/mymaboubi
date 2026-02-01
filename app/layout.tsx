import type { Metadata, Viewport } from "next"; // Ajout de Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NativeMobileUtils from "@/components/NativeMobileUtils";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. IMPORTANT : Configuration du Viewport pour mobile
// viewport-fit=cover permet d'utiliser toute la surface de l'écran (derrière l'encoche)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Mymaboubi App",
  description: "Application mobile Next.js",
  // Empêche iOS de transformer les numéros de téléphone en liens bleus partout
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
      
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          // On s'assure que le body prend toute la hauteur sans défilement inutile
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
         <NativeMobileUtils />
        {/* On peut ajouter une div de contenu qui respecte les zones de sécurité ici 
            ou le gérer directement dans globals.css */}
           
        <main className="safe-area-spacing">
          {children}
        </main>
      </body>
    </html>
  );
}