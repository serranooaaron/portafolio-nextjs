export const LANGUAGE_COLORS: Record<string, string> = {
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
  "Jupyter Notebook": "#da5b0b",
};

const relative = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function timeAgo(iso: string) {
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

// "https://github.com/usuario/repo(.git)(/...)" -> "usuario/repo"
export function repoSlug(url: string): string | null {
  const match = url.match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i);
  return match ? `${match[1]}/${match[2]}` : null;
}
