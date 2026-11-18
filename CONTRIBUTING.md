# Cómo se trabaja en este repositorio

## Ramas

`main` siempre está publicada: Vercel despliega cada cambio que entra. Por eso nada se sube directo a `main`. Cada cambio va en su propia rama, creada desde `main` al día, y entra por pull request.

| Prefijo | Para | Ejemplo |
|---|---|---|
| `feature/` | Sección o funcionalidad nueva | `feature/seccion-de-charlas` |
| `fix/` | Corrección de un error | `fix/tarjetas-en-celular` |
| `content/` | Textos, proyectos o datos del portafolio | `content/demo-de-la-tienda` |
| `refactor/` | Reorganizar código sin cambiar lo que se ve | `refactor/componentes-de-tarjeta` |
| `docs/` | Solo documentación | `docs/readme-token-github` |
| `ci/` | GitHub Actions | `ci/tipos-y-build-en-pull-requests` |
| `chore/` | Mantenimiento (dependencias, configuración) | `chore/actualizar-next` |

El nombre dice qué cambia, en minúsculas y con guiones.

## Pull requests

1. Subir la rama y abrir el PR contra `main`. Vercel arma una vista previa del PR, con su propia URL, para revisarlo antes de unirlo.
2. El chequeo **Tipos, build y dependencias** (GitHub Actions) corre:
   - `tsc --noEmit`;
   - `next build`;
   - `npm audit`.
   El PR se une solo con el chequeo en verde.
3. Se une con *Squash and merge*: un commit por cambio en `main`. Vercel publica la versión nueva.
4. Después de unir, borrar la rama en GitHub y en local.

## Commits

Título corto en imperativo y en español ("Sumar la demo de la tienda"). Debajo, viñetas con lo que cambia para quien visita el sitio.

## Antes de abrir el PR

```bash
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

El hook de pre-commit (ggshield) frena los commits que contienen secretos. No se salta con `--no-verify`.
