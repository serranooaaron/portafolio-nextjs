import type { CSSProperties, ReactNode } from "react";
import GitHubRepos from "@/components/GitHubRepos";
import StudentRepo from "@/components/StudentRepo";
import ThemeToggle from "@/components/ThemeToggle";
import { getRepo, getRepos, type Repo } from "@/lib/github-server";
import {
  GITHUB_USER,
  HAS_LINKS,
  contact,
  education,
  mentorships,
  teaching,
  profile,
  projects,
  skills,
  timeline,
  type Mentorship,
  type Project,
} from "@/data/portfolio";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const HUES = ["violet", "cyan", "pink", "amber", "green"] as const;

function formatMonth(date: string) {
  const [year, month] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <h2 className="section-head" data-reveal="rise">
      {title} <span>{sub}</span>
    </h2>
  );
}

function Reveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: "div" | "article";
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={className} data-reveal="scale" style={{ "--i": index } as CSSProperties}>
      {children}
    </Tag>
  );
}

function ProjectCard({ project, hue }: { project: Project; hue: string }) {
  return (
    <Reveal as="article" className={`card feature glow hue-${hue}`}>
      <div className="feature-body">
        <header className="card-head">
          <h3>{project.name}</h3>
          <time dateTime={project.date}>{formatMonth(project.date)}</time>
        </header>
        <p>{project.summary}</p>
        <Tags items={project.stack} />
        {((HAS_LINKS && project.repo) || project.demo) && (
          <footer className="card-links">
            {HAS_LINKS && project.repo && <a href={project.repo}>Código →</a>}
            {project.demo && <a href={project.demo}>Demo →</a>}
          </footer>
        )}
      </div>
      <ul className="highlights feature-panel">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </Reveal>
  );
}

// Franja decorativa: el mismo listado se lee completo y accesible en la sección Stack.
function Marquee({ items }: { items: string[] }) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];
  return (
    <div className="marquee" aria-hidden="true">
      {rows.map((row, r) => (
        <div key={r} className="marquee-row">
          {Array.from({ length: 4 }, () => row)
            .flat()
            .map((item, i) => (
              <span key={i} className={`marquee-item hue-${HUES[(i + r * 2) % HUES.length]}`}>
                {item}
              </span>
            ))}
        </div>
      ))}
    </div>
  );
}

function MentorshipCard({
  mentorship,
  repoInfo,
  hue,
  index,
}: {
  mentorship: Mentorship;
  repoInfo: Repo | null;
  hue: string;
  index: number;
}) {
  const { contribution = [], stack = [], authors = [] } = mentorship;
  return (
    <Reveal as="article" index={index} className={`card glow hue-${hue}`}>
      <header className="card-head">
        <h3>{mentorship.name}</h3>
        <time dateTime={mentorship.date}>{formatMonth(mentorship.date)}</time>
      </header>
      <p className="role">
        {mentorship.role ?? "Profesor mentor"} · {mentorship.subject}
      </p>
      {mentorship.school && <p className="school">{mentorship.school}</p>}
      {mentorship.summary && <p>{mentorship.summary}</p>}
      {authors.length > 0 && <p className="authors">Desarrollado por {authors.join(", ")}</p>}
      {contribution.length > 0 && (
        <ul className="highlights">
          {contribution.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      {stack.length > 0 && <Tags items={stack} />}
      {mentorship.repo && (
        <StudentRepo url={mentorship.repo} info={repoInfo} showDescription={!mentorship.summary} />
      )}
      {mentorship.demo && (
        <footer className="card-links">
          <a href={mentorship.demo}>Ver demo →</a>
        </footer>
      )}
    </Reveal>
  );
}

const NAV = [
  ["proyectos", "Proyectos"],
  ["repos", "Repos"],
  ["docencia", "Docencia"],
  ["trayectoria", "Trayectoria"],
  ["contacto", "Contacto"],
] as const;

// La página se regenera en Vercel cada 10 minutos con datos frescos de GitHub (ISR).
// Debe ser un número literal: Next.js lo lee al compilar. Mantenerlo igual a REVALIDATE_SECONDS.
export const revalidate = 600;

export default async function Home() {
  const sortedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const sortedTimeline = [...timeline].sort((a, b) => b.date.localeCompare(a.date));
  const studentProjects = mentorships
    .filter((m) => m.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Todas las consultas a GitHub en paralelo, en el servidor.
  const [reposResult, studentRepos] = await Promise.all([
    HAS_LINKS ? getRepos(GITHUB_USER) : null,
    Promise.all(studentProjects.map((m) => (m.repo ? getRepo(m.repo) : null))),
  ]);
  const allSkills = [...new Set(Object.values(skills).flat())];
  const techCount = allSkills.length;

  const contactItems = [
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: "✉" },
    contact.phone && {
      label: "Teléfono / WhatsApp",
      value: contact.phone,
      href: `https://wa.me/${contact.whatsapp || contact.phone.replace(/\D/g, "")}`,
      icon: "☏",
    },
    contact.linkedin && { label: "LinkedIn", value: "/in/serranooaaron", href: contact.linkedin, icon: "in" },
    contact.github && { label: "GitHub", value: `@${GITHUB_USER}`, href: contact.github, icon: "⌥" },
    contact.location && { label: "Ubicación", value: contact.location, icon: "⌖" },
  ].filter(Boolean) as { label: string; value: string; href?: string; icon: string }[];

  return (
    <>
      <header className="site-header is-at-top">
        <a href="#inicio" className="brand">
          <span className="brand-mark">{initials(profile.name)}</span>
          <span className="brand-name">{profile.name}</span>
        </a>
        <nav className="site-nav" aria-label="Secciones">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="hero-meta">
                <span className="available">
                  <span className="live-dot" aria-hidden="true" /> Disponible para trabajar
                </span>
                {contact.location && <span>{contact.location}</span>}
              </p>
              <p className="eyebrow">{profile.role}</p>
              <h1>
                Hola, soy <span className="gradient-text">{profile.name}</span>.
              </h1>
              <p className="pitch">{profile.pitch}</p>
              <p className="looking-for hue-cyan">
                Abierto a oportunidades en <strong>{profile.lookingFor}</strong>
              </p>
              <div className="hero-actions">
                <a href="#contacto" className="btn btn-primary">
                  Contactarme
                </a>
                <a href="#proyectos" className="btn btn-ghost">
                  Ver proyectos
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="avatar">
                <span className="avatar-halo" aria-hidden="true" />
                <span className="avatar-light" aria-hidden="true" />
                {profile.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photo} alt={`Foto de ${profile.name}`} />
                ) : (
                  <span className="avatar-initials" role="img" aria-label={`Iniciales de ${profile.name}`}>
                    {initials(profile.name)}
                  </span>
                )}
              </div>
              <div className="float-chip chip-a hue-pink">
                <strong>{techCount}</strong>
                <span>tecnologías</span>
              </div>
              <div className="float-chip chip-b hue-amber">
                <strong>{education.length}</strong>
                <span>títulos y carreras</span>
              </div>
              <div className="float-chip chip-c hue-green">
                <strong>{teaching.subjects.length}</strong>
                <span>materias que dicto</span>
              </div>
            </div>
          </div>
        </section>

        <div className="page-body">
          <section id="proyectos" className="section">
            <SectionHead title="Proyectos" sub="con código público" />
            <div className="feature-list">
              {sortedProjects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} hue={HUES[i % HUES.length]} />
              ))}
            </div>
          </section>
        </div>

        <Marquee items={allSkills} />

        <div className="page-body">
        <section id="repos" className="section">
          <SectionHead title="Repositorios públicos" sub="en vivo desde GitHub" />
          {reposResult ? (
            <GitHubRepos result={reposResult} />
          ) : (
            <p className="notice">
              Configura <code>GITHUB_USER</code> en <code>data/portfolio.ts</code> para ver tus repositorios en
              vivo.
            </p>
          )}
        </section>

        <section id="docencia" className="section">
          <SectionHead title="Docencia y mentoría" sub="formando técnicos" />
          <div className={studentProjects.length > 0 ? "teaching-layout" : undefined}>
            <div className="teaching-col">
              <h3 className="subhead">Mi rol</h3>
              <Reveal as="article" className="card glow hue-amber teaching-card">
                <p className="role">Docente · nivel técnico secundario</p>
                <p>{teaching.summary}</p>
                <h3 className="mini-title">Materias</h3>
                <Tags items={teaching.subjects} />
              </Reveal>
            </div>

            {studentProjects.length > 0 && (
              <div className="student-projects">
                <h3 className="subhead">Proyectos de mis alumnos</h3>
                <div className="student-grid">
                  {studentProjects.map((m, i) => (
                    <MentorshipCard
                      key={m.slug}
                      mentorship={m}
                      repoInfo={studentRepos[i]}
                      hue={HUES[(i + 2) % HUES.length]}
                      index={i + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          {studentProjects.length > 0 && (
            <p className="section-note after">
              Los proyectos de alumnos se publican con permiso de sus autores. Yo guío y reviso; el código es de
              los estudiantes.
            </p>
          )}
        </section>

        <section id="trayectoria" className="section">
          <SectionHead title="Trayectoria" sub="formación, este año y stack" />
          <div className="bento split">
          <Reveal className="tile glow hue-green">
            <h2 className="section-title">Formación</h2>
            <ol className="education">
              {education.map((e) => (
                <li key={e.title}>
                  <span className="edu-period">
                    {e.period}
                    {e.current && <span className="badge">En curso</span>}
                  </span>
                  <strong>{e.title}</strong>
                  {e.institution && <span className="edu-inst">{e.institution}</span>}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal index={1} className="tile glow hue-violet">
            <h2 className="section-title">Mi 2026</h2>
            <ol className="timeline">
              {sortedTimeline.map((item) => (
                <li key={item.date + item.title}>
                  <time dateTime={item.date}>{formatMonth(item.date)}</time>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="tile glow hue-cyan span-all">
            <h2 className="section-title">Stack</h2>
            <dl className="skills">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <dt>{group}</dt>
                  <dd>
                    <Tags items={items} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          </div>
        </section>
        </div>

        <section id="contacto" className="contact-band">
          <SectionHead title="Hablemos" sub="de tu próximo proyecto" />
          <Reveal className="tile contact-tile glow hue-pink">
            <div className="contact-intro">
              <p className="pitch">
                ¿Tienes un proyecto, una propuesta laboral o quieres que mentoree a tu equipo? Escríbeme.
              </p>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn btn-primary">
                  Enviar un email
                </a>
              )}
            </div>
            {contactItems.length > 0 ? (
              <ul className="contact-list">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} className="contact-item glow" target="_blank" rel="noreferrer">
                        <span className="contact-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>
                          <small>{item.label}</small>
                          {item.value}
                        </span>
                      </a>
                    ) : (
                      <div className="contact-item glow">
                        <span className="contact-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>
                          <small>{item.label}</small>
                          {item.value}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="notice">
                Completa <code>contact</code> en <code>data/portfolio.ts</code> con tus datos.
              </p>
            )}
          </Reveal>
        </section>
      </main>

      <a href="#contacto" className="btn btn-primary float-cta">
        Contactarme
      </a>

      <footer className="site-footer">
        © {new Date().getFullYear()} {profile.name} · Hecho con Next.js y desplegado en Vercel ·{" "}
        <a href="https://github.com/serranooaaron/portafolio-nextjs">Código fuente</a>
      </footer>
    </>
  );
}
