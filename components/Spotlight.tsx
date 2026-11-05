"use client";

import { useEffect } from "react";

// Duración del destello en CSS: al terminar se quita el efecto de toque.
const PRESS_MS = 900;

// Un solo listener para toda la página: le pasa la posición del mouse a la
// tarjeta .glow que está debajo, y el CSS dibuja el destello en ese punto.
// En pantallas táctiles hace lo mismo al tocar. pointerup no se dispara si el dedo
// empezó a hacer scroll, así que recorrer la página no enciende las tarjetas.
export default function Spotlight() {
  useEffect(() => {
    let frame = 0;
    let last: PointerEvent | null = null;

    function paint() {
      frame = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest<HTMLElement>(".glow");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    const timers = new Map<HTMLElement, number>();

    function onTap(e: PointerEvent) {
      if (e.pointerType === "mouse") return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = (e.target as Element | null)?.closest<HTMLElement>(".glow");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
      clearTimeout(timers.get(target));
      target.classList.remove("is-pressed");
      void target.offsetWidth; // reinicia la animación si se toca dos veces seguidas
      target.classList.add("is-pressed");
      timers.set(
        target,
        window.setTimeout(() => {
          target.classList.remove("is-pressed");
          timers.delete(target);
        }, PRESS_MS),
      );
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onTap, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onTap);
      cancelAnimationFrame(frame);
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return null;
}
