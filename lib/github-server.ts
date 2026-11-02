import "server-only";
import { repoSlug } from "@/lib/github";

// Las consultas a GitHub se hacen en el servidor de Vercel y se guardan en caché:
// todos los visitantes ven la misma respuesta y GitHub recibe como mucho una
// consulta por recurso cada REVALIDATE_SECONDS, sin importar cuántas visitas haya.
export const REVALIDATE_SECONDS = 600;

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export type ReposResult =
  | { ok: true; repos: Repo[]; fetchedAt: string }
  | { ok: false; message: string };

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Opcional: con un token (variable GITHUB_TOKEN en Vercel) el límite sube de 60 a 5.000 por hora.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

class GitHubError extends Error {
  constructor(readonly status: number) {
    super(`GitHub respondió ${status}`);
  }
}

async function github<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new GitHubError(res.status);
  return res.json() as Promise<T>;
}

// Si GitHub falla por un problema pasajero (límite de consultas, caída) mientras Vercel
// regenera la página, se relanza el error: así Vercel descarta la regeneración y sigue
// mostrando la última versión buena. Durante el build no hay versión previa, así que
// ahí se muestra el aviso. Un 404 no es pasajero: se maneja normalmente.
function keepPreviousVersionOn(err: unknown) {
  const transient = !(err instanceof GitHubError) || err.status !== 404;
  if (transient && process.env.NEXT_PHASE !== "phase-production-build") throw err;
}

export async function getRepos(user: string, limit = 9): Promise<ReposResult> {
  try {
    const data = await github<Repo[]>(`/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=100`);
    return {
      ok: true,
      repos: data.filter((r) => !r.fork && !r.archived).slice(0, limit),
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    keepPreviousVersionOn(err);
    return {
      ok: false,
      message:
        err instanceof GitHubError && err.status === 404
          ? "No encontré ese usuario de GitHub."
          : "Los repositorios no están disponibles en este momento. Se actualizan solos en unos minutos.",
    };
  }
}

// Datos de un repo a partir de su URL. Si es privado, no existe o GitHub falla, devuelve null.
export async function getRepo(url: string): Promise<Repo | null> {
  const slug = repoSlug(url);
  if (!slug) return null;
  try {
    return await github<Repo>(`/repos/${slug}`);
  } catch (err) {
    keepPreviousVersionOn(err);
    return null;
  }
}
