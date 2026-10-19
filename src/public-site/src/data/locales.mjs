export const locales = {
  en: {
    code: "en",
    path: "/",
    title: "ArcShape — Make architecture clear",
    description:
      "ArcShape helps teams create and maintain clear, useful architecture documentation with AI-assisted workflows.",
    nav: { workflow: "How it works", artifacts: "Artifacts" },
    eyebrow: "Architecture, made understandable",
    headline: ["Make your system’s architecture ", "clear."],
    lead:
      "ArcShape helps teams create, evolve, and explain software architecture documentation with AI-assisted workflows grounded in your repository.",
    explore: "Explore ArcShape on GitHub",
    browse: "Browse engineering artifacts",
    note: "Open source tooling. Your repository stays yours.",
    heroArt:
      "Architecture work moves through understanding, documentation, and maintenance",
    stages: ["Understand", "Document", "Maintain"],
    principles: [
      "Repository-grounded",
      "Human-reviewed",
      "Standards-aware",
      "Open source",
    ],
    workflowEyebrow: "A practical workflow",
    workflowTitle: "Turn system knowledge into something people can use.",
    workflowIntro:
      "ArcShape supports the work around architecture documentation, from understanding a repository to keeping its architectural view useful over time.",
    steps: [
      {
        title: "Start with the repository",
        text: "Use repository context and evidence to orient architecture work and keep documentation connected to the system.",
      },
      {
        title: "Shape the architecture",
        text: "Create and maintain arc42 documentation, decisions, and C4 diagrams through assisted workflows.",
      },
      {
        title: "Share a clear view",
        text: "Publish a navigable architecture reader derived from the canonical Markdown sources.",
      },
    ],
    artifactsEyebrow: "Clear sources. Useful views.",
    artifactsTitle: "Documentation people can trust and navigate.",
    artifactsIntro:
      "ArcShape keeps Markdown as the source of truth and generates a reader for exploring the architecture. Product definition and architecture documentation remain explicit, reviewable inputs.",
    architecture: "Explore the architecture snapshot",
    canonicalSource: "CANONICAL SOURCE",
    sourceTitle: "Architecture Markdown",
    sourceText: "Reviewed in your repository",
    generatedView: "GENERATED VIEW",
    readerTitle: "Architecture reader",
    readerText: "Derived, navigable, source-linked",
    closingEyebrow: "Explore ArcShape",
    closingTitle:
      "Good architecture documentation starts with what is already known.",
    closingIntro:
      "See the project, its current capabilities, and the engineering artifacts behind this site.",
    viewRepository: "View the repository",
    footerText: "Architecture documentation, made clear.",
    engineering: "Engineering portal",
    langName: "English",
    skip: "Skip to content",
  },
  es: {
    code: "es",
    path: "/es/",
    title: "ArcShape — Arquitectura clara",
    description:
      "ArcShape ayuda a los equipos a crear y mantener documentación de arquitectura clara y útil con flujos de trabajo asistidos por IA.",
    nav: { workflow: "Cómo funciona", artifacts: "Artefactos" },
    eyebrow: "Arquitectura, fácil de entender",
    headline: ["Haz clara la arquitectura ", "de tu sistema."],
    lead:
      "ArcShape ayuda a los equipos a crear, evolucionar y explicar la documentación de arquitectura de software con flujos asistidos por IA basados en su repositorio.",
    explore: "Explora ArcShape en GitHub",
    browse: "Ver artefactos de ingeniería",
    note: "Herramientas de código abierto. Tu repositorio sigue siendo tuyo.",
    heroArt:
      "El trabajo de arquitectura avanza mediante comprensión, documentación y mantenimiento",
    stages: ["Comprender", "Documentar", "Mantener"],
    principles: [
      "Basado en el repositorio",
      "Revisado por personas",
      "Basado en estándares",
      "Código abierto",
    ],
    workflowEyebrow: "Un flujo de trabajo práctico",
    workflowTitle: "Convierte el conocimiento del sistema en algo útil.",
    workflowIntro:
      "ArcShape acompaña el trabajo de documentación de arquitectura: desde comprender un repositorio hasta mantener útil su visión arquitectónica.",
    steps: [
      {
        title: "Empieza por el repositorio",
        text: "Usa el contexto y la evidencia del repositorio para orientar el trabajo de arquitectura y mantener la documentación conectada al sistema.",
      },
      {
        title: "Define la arquitectura",
        text: "Crea y mantén documentación arc42, decisiones y diagramas C4 mediante flujos de trabajo asistidos.",
      },
      {
        title: "Comparte una visión clara",
        text: "Publica un lector de arquitectura navegable, generado desde las fuentes Markdown canónicas.",
      },
    ],
    artifactsEyebrow: "Fuentes claras. Vistas útiles.",
    artifactsTitle: "Documentación fiable y fácil de recorrer.",
    artifactsIntro:
      "ArcShape conserva Markdown como fuente de verdad y genera un lector para explorar la arquitectura. La definición del producto y la documentación de arquitectura siguen siendo entradas explícitas y revisables.",
    architecture: "Explora la instantánea de arquitectura",
    canonicalSource: "FUENTE CANÓNICA",
    sourceTitle: "Markdown de arquitectura",
    sourceText: "Revisado en tu repositorio",
    generatedView: "VISTA GENERADA",
    readerTitle: "Lector de arquitectura",
    readerText: "Derivado, navegable y enlazado a sus fuentes",
    closingEyebrow: "Explora ArcShape",
    closingTitle:
      "Una buena documentación de arquitectura empieza por lo que ya sabemos.",
    closingIntro:
      "Conoce el proyecto, sus capacidades actuales y los artefactos de ingeniería que respaldan este sitio.",
    viewRepository: "Ver el repositorio",
    footerText: "Documentación de arquitectura, con claridad.",
    engineering: "Portal de ingeniería",
    langName: "Español",
    skip: "Ir al contenido",
  },
};

export function getLocale(code) {
  const locale = locales[code];
  if (!locale) throw new Error(`Unknown public-site locale: ${code}`);
  return locale;
}
