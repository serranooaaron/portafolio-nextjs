"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const START_ANGLE = 35;
// Giro por cuadro a 60 fps: el recorrido suave de siempre y el extra con el mouse encima.
const BASE_SPEED = 0.1;
const MOUSE_SPEED = 0.6;
// Distancia desde el borde de la foto a la que el mouse empieza a empujar las burbujas.
const REACH_PX = 180;
// Qué tan rápido cambia la velocidad: valores chicos dan un movimiento más gradual.
const SMOOTHING = 0.04;

// Separación mínima entre cada burbuja y el borde de la foto.
const GAP_PX = 8;

const HUES = ["cyan", "violet", "pink"];

// Hasta este ancho no entra una órbita por fuera de la foto: el CSS deja las burbujas fijas flotando.
const FIXED_LAYOUT = "(max-width: 1200px)";

// Burbujas que rodean la foto por fuera sin girar el texto: siempre se leen en horizontal.
// Cada burbuja se ubica a la distancia justa para no tocar el círculo, según su ancho y su ángulo.
// Si el hero no está en pantalla, no se calcula nada.
export default function PhotoOrbit({ titles }: { titles: string[] }) {
  const orbit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = orbit.current;
    if (!element) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia(FIXED_LAYOUT).matches) return;

    const slots = [...element.querySelectorAll<HTMLElement>(".orbit-slot")];
    const place = (turn: number) => {
      const radius = element.offsetWidth / 2 + GAP_PX;
      slots.forEach((slot, i) => {
        const bubble = slot.firstElementChild as HTMLElement;
        const halfWidth = bubble.offsetWidth / 2;
        const halfHeight = bubble.offsetHeight / 2;
        const rad = ((turn + (360 * i) / slots.length) * Math.PI) / 180;
        const x = Math.sin(rad);
        const y = -Math.cos(rad);
        // Busca la distancia mínima a la que el rectángulo de la burbuja queda fuera del círculo.
        let low = radius;
        let high = radius + halfWidth + halfHeight;
        for (let step = 0; step < 10; step++) {
          const middle = (low + high) / 2;
          const clear = Math.hypot(
            Math.max(0, Math.abs(x) * middle - halfWidth),
            Math.max(0, Math.abs(y) * middle - halfHeight),
          );
          if (clear >= radius) high = middle;
          else low = middle;
        }
        slot.style.transform = `translate(${(x * high).toFixed(1)}px, ${(y * high).toFixed(1)}px)`;
      });
    };

    let angle = START_ANGLE;
    let speed = BASE_SPEED;
    let target = BASE_SPEED;
    let direction = 1;
    let lastPolar: number | null = null;
    let lastTime = 0;
    let frame = 0;

    function tick(time: number) {
      const steps = lastTime ? Math.min((time - lastTime) / 16.67, 3) : 1;
      lastTime = time;
      speed += (target - speed) * SMOOTHING * steps;
      angle += speed * steps;
      place(angle);
      frame = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = element!.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const outside = Math.max(0, Math.hypot(x, y) - rect.width / 2);
      const closeness = Math.max(0, 1 - outside / REACH_PX);

      // Las burbujas siguen el sentido en que el mouse rodea la foto.
      const polar = Math.atan2(y, x);
      if (lastPolar !== null) {
        const delta = Math.atan2(Math.sin(polar - lastPolar), Math.cos(polar - lastPolar));
        if (Math.abs(delta) > 0.002) direction = Math.sign(delta);
      }
      lastPolar = polar;
      target = (BASE_SPEED + closeness * MOUSE_SPEED) * direction;
    }

    place(angle);

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    visibility.observe(element);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      visibility.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={orbit} className="photo-orbit" aria-hidden="true">
      {titles.map((title, i) => (
        <span key={title} className="orbit-slot" style={{ "--i": i, "--n": titles.length } as CSSProperties}>
          <span className={`orbit-bubble hue-${HUES[i % HUES.length]}`}>{title}</span>
        </span>
      ))}
    </div>
  );
}
