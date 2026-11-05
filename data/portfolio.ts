// Fuente de datos del portafolio. Mantenerlo en sincronía con registro-2026.md.

import stackLogos from "./stack-logos.json";

export const GITHUB_USER: string = "serranooaaron";

// Mientras GITHUB_USER sea el marcador, la página no muestra enlaces rotos.
export const HAS_LINKS = GITHUB_USER !== "USUARIO";

export type Project = {
  slug: string;
  name: string;
  date: string; // YYYY-MM
  summary: string;
  highlights: string[]; // tres como máximo: lo demás va en el README del repo
  stack: string[];
  image: string; // captura real en public/proyectos, con datos de prueba
  imageAlt: string;
  repo?: string;
  demo?: string;
  featured: boolean;
};

// Proyectos de alumnos que acompañé como docente: el código es de ellos.
// Para sumar uno alcanza con slug, name, date, subject, repo y published.
// Descripción, lenguaje, estrellas y última actualización se leen del repo en vivo.
export type Mentorship = {
  slug: string;
  name: string;
  date: string; // YYYY-MM
  subject: string; // materia en la que se desarrolló
  school?: string;
  repo?: string; // URL del repo de los alumnos en GitHub
  demo?: string;
  // Solo se muestra con published: true. Ponerlo recién cuando los alumnos
  // (y la escuela, si corresponde) dieron permiso para publicarlo.
  published: boolean;
  role?: string; // por defecto "Profesor mentor"
  summary?: string; // si falta, se usa la descripción del repo
  contribution?: string[]; // mi aporte como docente
  stack?: string[];
  authors?: string[]; // nombres solo si los alumnos aceptaron aparecer
};

export type TimelineItem = {
  date: string; // YYYY-MM
  title: string;
  detail: string;
};

export type EducationItem = {
  title: string;
  institution?: string;
  period: string;
  current?: boolean;
};

export const profile = {
  name: "Aaron Serrano",
  role: "Data Analyst · Data Scientist · Docente IT",
  // Roles a los que apunto: se destacan en el hero.
  roles: ["Data Analyst", "Data Scientist", "Docente IT"],
  // Títulos que giran alrededor de la foto.
  orbit: ["Data Science", "Data Analyst", "Machine Learning"],
  pitch:
    "Técnico Superior en Análisis de Sistemas y estudiante avanzado de Ciencia de Datos. Combino ingeniería de software rigurosa con pensamiento analítico: entiendo los datos, sé modelarlos y tomo decisiones técnicas con criterio.",
  // Archivo en public/. Con null se muestran las iniciales.
  photo: "/foto.png" as string | null,
  links: {
    github: `https://github.com/${GITHUB_USER}`,
    linkedin: "https://www.linkedin.com/in/serranooaaron/",
  },
};

// Datos de contacto públicos. Los campos vacíos no se muestran.
export const contact = {
  email: "aaronsebastianserrano@gmail.com",
  phone: "+54 11 4163-2769",
  // Formato internacional de WhatsApp para celulares de Argentina: 54 9 + área + número.
  whatsapp: "5491141632769",
  location: "CABA, Buenos Aires, Argentina",
  linkedin: HAS_LINKS ? profile.links.linkedin : "",
  github: HAS_LINKS ? profile.links.github : "",
};

export const projects: Project[] = [
  {
    slug: "biblioteca-digital",
    name: "Biblioteca Digital",
    date: "2026-11",
    summary:
      "Aplicación web de biblioteca: catálogo, préstamos y devoluciones de libros, con panel para administrar libros, préstamos y usuarios.",
    highlights: [
      "Préstamos con vencimiento y avisos para lectores y administradores",
      "Roles con JWT en cookie httpOnly y contraseñas con bcrypt",
      "38 tests de integración y API documentada con Swagger",
    ],
    stack: ["Node.js", "Express", "Handlebars", "MongoDB", "JWT", "Mocha"],
    image: "/proyectos/biblioteca-digital.webp",
    imageAlt: "Página de inicio de Biblioteca Digital, con un estante de libros y los datos del catálogo",
    repo: `https://github.com/${GITHUB_USER}/biblioteca-digital`,
    featured: true,
  },
  {
    slug: "tienda-gamer",
    name: "Tienda Gamer",
    date: "2026-11",
    summary:
      "E-commerce de periféricos gamer: catálogo con filtros, carrito por usuario y panel de administración de productos.",
    highlights: [
      "Catálogo con búsqueda, categorías, stock y paginación",
      "Cuentas con JWT y un carrito que solo opera su dueño",
      "Panel de administración y 63 tests automáticos de la API",
    ],
    stack: ["Node.js", "Express", "Handlebars", "MongoDB", "JWT", "Mocha"],
    image: "/proyectos/tienda-gamer.webp",
    imageAlt: "Página de inicio de Tienda Gamer, con un micrófono destacado y el acceso al catálogo",
    repo: `https://github.com/${GITHUB_USER}/tienda-gamer`,
    featured: true,
  },
];

export const mentorships: Mentorship[] = [
  {
    slug: "sgn",
    name: "SGN – Sistema de Gestión de Notas",
    date: "2026-10",
    subject: "Prácticas Profesionalizantes",
    school: "E.T. N° 35 \"Ing. Eduardo Latzina\"",
    repo: "", // pegar acá el link del repo de las alumnas
    published: true,
    summary:
      "Sistema web de calificaciones, legajos e inscripciones de la escuela, desarrollado por alumnas en Prácticas Profesionalizantes.",
    contribution: [
      "Guío el diseño y reviso el código; las alumnas lo siguen mejorando según mis correcciones",
      "Acompañamiento en seguridad: roles, JWT y manejo de contraseñas",
    ],
    stack: ["Java", "Spring Boot", "Next.js", "TypeScript"],
  },
  // Plantilla para el próximo proyecto (copiar, completar y poner published: true):
  // {
  //   slug: "nombre-corto",
  //   name: "Nombre del proyecto",
  //   date: "2026-11",
  //   subject: "Prácticas Profesionalizantes",
  //   repo: "https://github.com/usuario/repo",
  //   published: false,
  // },
];

export const timeline: TimelineItem[] = [
  { date: "2026-04", title: "Backend e-commerce", detail: "Express, MongoDB y Handlebars" },
  { date: "2026-08", title: "Biblioteca Digital API", detail: "API testeada y documentada con Swagger" },
  { date: "2026-11", title: "Tienda Gamer y Biblioteca Digital", detail: "Front completo, usuarios con JWT y correcciones de seguridad" },
  { date: "2026-10", title: "Mentoría del SGN", detail: "Prácticas Profesionalizantes en la ET35" },
];

export const education: EducationItem[] = [
  { title: "Licenciatura en Ciencias de Datos", institution: "UNICABA", period: "2025 – actualidad", current: true },
  { title: "Técnico Superior Analista en Sistemas", institution: "IFTS N°4", period: "2024" },
  { title: "Técnico en Computación", institution: "E.T. N°37 D.E. 11 - Hogar Naval Stella Maris", period: "2021" },
];

export const teaching = {
  summary:
    "Docente de nivel técnico secundario, con foco en la inserción laboral de mis estudiantes. Enseñar me formó como profesional: desarrollé criterio para explicar, liderar y acompañar procesos complejos.",
  subjects: ["Programación Orientada a Objetos", "Prácticas Profesionalizantes"],
};

// Tecnología → logo en public/stack. Las que no tienen logo muestran sus iniciales.
export const logos: Record<string, string> = stackLogos;

export const skills: Record<string, string[]> = {
  Lenguajes: ["Java 21", "JavaScript", "Python", "C#", "C++", "PHP"],
  "Backend y frameworks": ["Spring Boot", "Node.js", "Express", "FastAPI", "Django", "Laravel", "React"],
  "Ciencia de Datos y ML": ["Pandas", "NumPy", "Jupyter", "Machine Learning", "Estadística"],
  "Bases de datos": ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
  "DevOps y calidad": ["Docker", "Git", "Swagger", "Mocha", "Chai", "Supertest"],
};
