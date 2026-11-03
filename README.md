# Portafolio · Aaron Serrano

Mi portafolio personal: proyectos, docencia, formación y repositorios públicos de GitHub en vivo.

🌐 **https://serranopf.vercel.app**

## Stack

- Next.js 16 (App Router, página estática) + React 19 + TypeScript
- CSS propio: tema claro/oscuro, grilla responsive en bloques y efecto de destello al pasar el mouse
- API de GitHub consultada desde el servidor con caché de 10 minutos (ISR): los visitantes nunca consultan a GitHub directamente, así que no les afecta el límite de consultas
- Desplegado en Vercel

## Desarrollo

```bash
npm install
npm run dev
```

## Actualizar contenido

Todo el contenido sale de [`data/portfolio.ts`](data/portfolio.ts):

- `projects`: proyectos propios (`featured: true` los muestra primero)
- `mentorships`: proyectos de estudiantes que acompaño como docente (ver abajo)
- `education`, `teaching`, `timeline`, `skills`: formación, docencia, línea de tiempo y stack
- `contact`: datos de contacto (los campos vacíos no se muestran)

La foto está en `public/foto.png`.

### Sumar un proyecto de alumnos

1. Pedir permiso a los alumnos (y a la escuela, si corresponde) para publicarlo.
2. En `data/portfolio.ts`, copiar la plantilla al final de `mentorships` y completar:

   ```ts
   {
     slug: "nombre-corto",
     name: "Nombre del proyecto",
     date: "2026-11",
     subject: "Prácticas Profesionalizantes",
     repo: "https://github.com/usuario/repo",
     published: true,
   },
   ```

   Con eso alcanza: la tarjeta lee del repo la descripción, el lenguaje, las estrellas y la última actualización. Opcionales: `school`, `summary`, `contribution` (tu aporte), `stack`, `demo` y `authors` (nombres, solo si los alumnos aceptaron aparecer).
3. Mientras no haya permiso, dejar `published: false`: el proyecto queda cargado pero no se muestra.

## Token de GitHub (opcional)

Sin token, el servidor puede hacer 60 consultas por hora a GitHub, de sobra con la caché de 10 minutos. Para subir el límite a 5.000:

1. En GitHub → Settings → Developer settings → Fine-grained tokens, crear un token con acceso **solo a repositorios públicos** y sin permisos extra.
2. En Vercel → proyecto `portafolio` → Settings → Environment Variables, agregar `GITHUB_TOKEN` con ese valor.
3. Volver a desplegar.

El token nunca va en el código ni en el repo.

## Despliegue

El repo está conectado a Vercel: cada `git push` a `main` publica una nueva versión.
