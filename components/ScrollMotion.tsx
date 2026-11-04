"use client";

import { useEffect } from "react";

// Recorrido máximo, en píxeles, de las franjas de tecnologías mientras cruzan la pantalla.
const MARQUEE_TRAVEL = 600;

// Todo el movimiento ligado al scroll en un solo componente:
// - muestra los elementos [data-reveal] cuando entran en pantalla (una sola vez);
// - pasa el avance del scroll al CSS por variables (--p en el hero, --shift en las franjas);
// - quita el fondo del encabezado arriba de todo y muestra el botón flotante de contacto.
export default function ScrollMotion() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>(".hero");
    const contact = document.querySelector<HTMLElement>("#contacto");
    const floatCta = document.querySelector<HTMLElement>(".float-cta");
    const marquees = [...document.querySelectorAll<HTMLElement>(".marquee")];

    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      document.querySelectorAll("[data-reveal]").forEach((el) => observer?.observe(el));
    }

    let frame = 0;

    function paint() {
      frame = 0;
      const y = window.scrollY;
      const viewport = window.innerHeight;
      const heroHeight = hero?.offsetHeight ?? 0;

      header?.classList.toggle("is-at-top", y < 24);

      const contactTop = contact?.getBoundingClientRect().top ?? Infinity;
      floatCta?.classList.toggle("is-visible", y > heroHeight * 0.7 && contactTop > viewport * 0.8);

      if (reduced) return;

      hero?.style.setProperty("--p", Math.min(y / (heroHeight || 1), 1).toFixed(3));

      for (const marquee of marquees) {
        const rect = marquee.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) continue;
        const progress = (viewport - rect.top) / (viewport + rect.height);
        marquee.style.setProperty("--shift", `${(progress * MARQUEE_TRAVEL).toFixed(1)}px`);
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    paint();
    document.documentElement.dataset.motionReady = "true";
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return null;
}
