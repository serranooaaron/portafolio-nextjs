"use client";

import { useEffect } from "react";

// Un solo listener para toda la página: le pasa la posición del mouse a la
// tarjeta .glow que está debajo, y el CSS dibuja el destello en ese punto.
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

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
