"use client";

import { useCallback, useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; repos: Repo[]; fetchedAt: Date };

// Sin token, la API pública de GitHub permite 60 pedidos por hora por visitante.
const REFRESH_MS = 5 * 60 * 1000;

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#663399",
  Handlebars: "#f7931e",
  Shell: "#89e051",
  PHP: "#4f5d95",
  "C#": "#178600",
};

const relative = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function timeAgo(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "hace un momento";
}

export default function GitHubRepos({ user, limit = 9 }: { user: string; limit?: number }) {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=100`,
        { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" },
      );
      if (res.status === 404) throw new Error("No encontré ese usuario de GitHub.");
      if (res.status === 403 || res.status === 429)
        throw new Error("GitHub limitó las consultas por ahora. Vuelve a intentar en unos minutos.");
      if (!res.ok) throw new Error(`GitHub respondió ${res.status}.`);
      const data: Repo[] = await res.json();
      const repos = data.filter((r) => !r.fork && !r.archived).slice(0, limit);
      setState({ status: "ready", repos, fetchedAt: new Date() });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "No se pudieron cargar los repositorios.",
      });
    }
  }, [user, limit]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const onFocus = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [load]);

  if (state.status === "loading") {
    return (
      <div className="repo-grid" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="repo-card skeleton" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="notice">
        <p>{state.message}</p>
        <button type="button" className="btn btn-ghost" onClick={load}>
          Reintentar
        </button>
      </div>
    );
  }

  if (state.repos.length === 0) {
    return <p className="notice">Todavía no hay repositorios públicos.</p>;
  }

  return (
    <>
      <p className="live-status">
        <span className="live-dot" aria-hidden="true" /> En vivo desde GitHub · actualizado{" "}
        {state.fetchedAt.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <div className="repo-grid">
        {state.repos.map((repo) => (
          <a key={repo.id} href={repo.html_url} className="repo-card glow" target="_blank" rel="noreferrer">
            <h3>{repo.name}</h3>
            <p>{repo.description ?? "Sin descripción"}</p>
            <div className="repo-meta">
              {repo.language && (
                <span>
                  <span
                    className="lang-dot"
                    style={{ background: LANGUAGE_COLORS[repo.language] ?? "var(--accent)" }}
                  />
                  {repo.language}
                </span>
              )}
              <span title="Estrellas">★ {repo.stargazers_count.toLocaleString("es")}</span>
              <span title="Forks">⑂ {repo.forks_count.toLocaleString("es")}</span>
              <span className="repo-time">{timeAgo(repo.pushed_at)}</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
