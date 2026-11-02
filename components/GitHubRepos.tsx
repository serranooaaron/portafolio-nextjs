import { LANGUAGE_COLORS, timeAgo } from "@/lib/github";
import type { ReposResult } from "@/lib/github-server";

// Recibe los repos ya cargados (y cacheados) en el servidor: el navegador no consulta a GitHub.
export default function GitHubRepos({ result }: { result: ReposResult }) {
  if (!result.ok) {
    return <p className="notice">{result.message}</p>;
  }

  if (result.repos.length === 0) {
    return <p className="notice">Todavía no hay repositorios públicos.</p>;
  }

  return (
    <>
      <p className="live-status">
        <span className="live-dot" aria-hidden="true" /> Datos de GitHub · se actualizan cada 10 minutos
      </p>
      <div className="repo-grid">
        {result.repos.map((repo) => (
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
