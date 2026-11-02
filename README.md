# Portafolio · Aaron Serrano

Mi portafolio personal: proyectos, docencia, formación y repositorios públicos de GitHub en vivo.

🌐 **https://portafolio-rho-one-62.vercel.app**

## Stack

- Next.js 16 (App Router, página estática) + React 19 + TypeScript
- CSS propio: tema claro/oscuro, grilla responsive en bloques y efecto de destello al pasar el mouse
- API pública de GitHub para mostrar los repositorios en vivo
- Desplegado en Vercel

## Desarrollo

```bash
npm install
npm run dev
```

## Actualizar contenido

Todo el contenido sale de [`data/portfolio.ts`](data/portfolio.ts):

- `projects`: proyectos propios (`featured: true` los muestra primero)
- `mentorships`: proyectos de estudiantes que acompaño como docente
- `education`, `teaching`, `timeline`, `skills`: formación, docencia, línea de tiempo y stack
- `contact`: datos de contacto (los campos vacíos no se muestran)

La foto está en `public/foto.png`.

## Despliegue

El repo está conectado a Vercel: cada `git push` a `main` publica una nueva versión.
