"use client";

import { useEffect, useState } from "react";
import { LANGUAGE_COLORS, repoSlug, timeAgo } from "@/lib/github";

type RepoInfo = {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
};

// Muestra datos en vivo del repo de los alumnos. Si el repo es privado,
// no existe o GitHub limita las consultas, solo queda el enlace.
export default function StudentRepo({ url, showDescription }: { url: string; showDescription: boolean }) {
  const slug = repoSlug(url);
  const [info, setInfo] = useState<RepoInfo | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`https://api.github.com/repos/${slug}`, { headers: { Accept: "application/vnd.github+json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RepoInfo | null) => {
        if (!cancelled && data) setInfo(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

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
