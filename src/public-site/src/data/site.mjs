export const repository = "https://github.com/juangcarmona/arcshape";
export const portal = "https://juangcarmona.github.io/arcshape/";
export const architecture = `${portal}architecture/`;
export const tagline = "Engineering documentation";
export const steps = [
  {
    title: "Understand the system",
    text: "Investigate your repository with AI-assisted workflows. Record the evidence, questions, and gaps that need your attention.",
  },
  {
    title: "Document the architecture",
    text: "Describe the system’s structure, explain its behavior, and record why decisions were made. Review the changes as Markdown in Git.",
  },
  {
    title: "Publish a reader",
    text: "Build a browsable architecture reader from your documentation. Share it with the people who build, operate, and use the system.",
  },
];
// Names follow the official template; descriptions and examples are written for this guide.
export const arc42Sections = [
  [
    "Introduction and Goals",
    "Explain what the system is for, who needs it, and which quality goals matter most.",
    "Customers need to reserve a seat, and operators need to prevent double bookings.",
  ],
  [
    "Constraints",
    "Record the technical and organizational limits that shape the architecture.",
    "The system must use the organization’s identity provider and run in its existing cloud environment.",
  ],
  [
    "Context and Scope",
    "Show the system boundary, its users, and the external systems it communicates with.",
    "A context diagram shows customers, booking staff, the payment provider, and the email service.",
  ],
  [
    "Solution Strategy",
    "Explain the main architectural approach and how it addresses the system’s goals.",
    "Keep seat reservations in one transactional store so two customers cannot book the same seat.",
  ],
  [
    "Building Block View",
    "Describe the system’s parts, their responsibilities, and how they fit together.",
    "The booking service owns reservations; the payment adapter connects to the payment provider.",
  ],
  [
    "Runtime View",
    "Walk through important scenarios to explain how the parts interact while the system runs.",
    "Follow a reservation from the customer’s request through seat allocation, payment, and confirmation.",
  ],
  [
    "Deployment View",
    "Show where the software runs and how it maps to infrastructure and environments.",
    "Map the web application, booking service, and database to their production infrastructure.",
  ],
  [
    "Crosscutting Concepts",
    "Explain approaches that apply across several parts of the system.",
    "Describe how services authenticate requests, handle errors, and attach correlation IDs to logs.",
  ],
  [
    "Architecture Decisions",
    "Record consequential choices, their alternatives, and the reasons behind them.",
    "Explain why the team chose a relational database, including the trade-offs it accepted.",
  ],
  [
    "Quality Requirements",
    "Make quality expectations concrete enough to discuss and evaluate.",
    "During the expected booking peak, a seat reservation should complete within the agreed response-time target.",
  ],
  [
    "Risks and Technical Debt",
    "Keep known architectural risks and deferred work visible, together with their consequences.",
    "A payment-provider outage currently blocks checkout; document the impact and the proposed recovery approach.",
  ],
  [
    "Glossary",
    "Define terms that readers need to interpret the architecture consistently.",
    "Distinguish a temporary seat hold from a confirmed booking.",
  ],
].map(([title, purpose, example], index) => ({
  number: index + 1,
  title,
  purpose,
  example,
  href: `https://docs.arc42.org/section-${index + 1}/`,
}));
