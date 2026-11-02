import { LANGUAGE_COLORS, repoSlug, timeAgo } from "@/lib/github";
import type { Repo } from "@/lib/github-server";

// Datos del repo de los alumnos, cargados en el servidor. Si el repo es privado,
// no existe o GitHub falla (info null), solo queda el enlace.
export default function StudentRepo({
  url,
  info,
  showDescription,
}: {
  url: string;
  info: Repo | null;
  showDescription: boolean;
}) {
  const slug = repoSlug(url);

  return (
    <div className="student-repo">
      {showDescription && info?.description && <p>{info.description}</p>}
      <a href={url} target="_blank" rel="noreferrer" className="student-repo-link">
        <span aria-hidden="true">⌥</span> {slug ?? url}
      </a>
      {info && (
        <div className="repo-meta">
          {info.language && (
            <span>
              <span
                className="lang-dot"
                style={{ background: LANGUAGE_COLORS[info.language] ?? "var(--accent)" }}
              />
              {info.language}
            </span>
          )}
          <span title="Estrellas">★ {info.stargazers_count.toLocaleString("es")}</span>
          <span>actualizado {timeAgo(info.pushed_at)}</span>
        </div>
      )}
    </div>
  );
}
