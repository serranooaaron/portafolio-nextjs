import type { Metadata, Viewport } from "next";
import { profile } from "@/data/portfolio";
import ScrollMotion from "@/components/ScrollMotion";
import Spotlight from "@/components/Spotlight";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.role}`,
  description: profile.pitch,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b14" },
  ],
};

// Aplica el tema antes de pintar para evitar un destello del tema equivocado.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

// Activa las animaciones de entrada antes de pintar. Si el JavaScript de la página no llega
// a cargar, las quita a los 3 segundos para que ningún contenido quede oculto.
const motionScript = `(function(){var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("motion");setTimeout(function(){if(!r.dataset.motionReady)r.classList.remove("motion")},3000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <Spotlight />
        <ScrollMotion />
        {children}
      </body>
    </html>
  );
}
