// Everything personal about the site lives here. Swap these values for your own
// details and the whole site (header, hero, about page, footer, RSS, metadata) follows.

export const site = {
  name: "Alex Rivera",
  shortName: "Alex",
  role: "Full-Stack Developer",
  tagline: "I build friendly, fast and slightly whimsical things for the web.",
  description:
    "Articles, tutorials and projects by Alex Rivera, a full-stack developer who loves CSS, React, animation and the occasional database.",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  email: "hello@example.com",
  location: "Somewhere with good coffee",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "CodePen", href: "https://codepen.io/" },
    { label: "Bluesky", href: "https://bsky.app/" },
  ],
  nav: [
    { label: "Articles", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const categories = [
  { slug: "css", label: "CSS" },
  { slug: "react", label: "React" },
  { slug: "animation", label: "Animation" },
  { slug: "javascript", label: "JavaScript" },
  { slug: "nextjs", label: "Next.js" },
  { slug: "career", label: "Career" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryLabel(slug: string) {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

export const projects = [
  {
    title: "Tidepool",
    year: 2026,
    description:
      "A realtime collaborative whiteboard. Cursors, sticky notes and a CRDT sync layer that survives flaky train Wi-Fi.",
    tags: ["React", "TypeScript", "WebSockets", "Yjs"],
    href: "https://github.com/",
    hue: 195,
    featured: true,
  },
  {
    title: "Pantry",
    year: 2025,
    description:
      "Recipe planner that turns a week of meals into one sorted shopping list. Postgres full-text search does the heavy lifting.",
    tags: ["Next.js", "PostgreSQL", "Prisma"],
    href: "https://github.com/",
    hue: 25,
    featured: true,
  },
  {
    title: "Springboard",
    year: 2025,
    description:
      "A tiny spring-physics animation library (2 kB) with a visual editor for tuning stiffness and damping by feel.",
    tags: ["JavaScript", "Animation", "Canvas"],
    href: "https://github.com/",
    hue: 280,
    featured: true,
  },
  {
    title: "Lighthouse Bot",
    year: 2024,
    description:
      "GitHub App that runs performance audits on every pull request and comments when Core Web Vitals regress.",
    tags: ["Node.js", "GitHub API", "Puppeteer"],
    href: "https://github.com/",
    hue: 140,
    featured: false,
  },
  {
    title: "Palette Party",
    year: 2024,
    description:
      "Generates accessible colour palettes from a photo and checks every pairing against WCAG contrast rules.",
    tags: ["CSS", "Color science", "Vite"],
    href: "https://github.com/",
    hue: 330,
    featured: false,
  },
  {
    title: "Ledger Lite",
    year: 2023,
    description:
      "Offline-first budgeting PWA. IndexedDB on the device, optional encrypted sync to a small Express API.",
    tags: ["PWA", "Express", "IndexedDB"],
    href: "https://github.com/",
    hue: 50,
    featured: false,
  },
];

export const experience = [
  {
    start: "2024",
    end: "Present",
    role: "Senior Full-Stack Engineer",
    company: "Brightwave",
    description:
      "Lead the web platform team. Rebuilt the design system, moved the dashboard to React Server Components and cut median page load by 41%.",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    start: "2021",
    end: "2024",
    role: "Full-Stack Engineer",
    company: "Northstar Labs",
    description:
      "Built the public API and its documentation site, owned billing integrations, and mentored four junior developers.",
    tags: ["TypeScript", "GraphQL", "Stripe", "AWS"],
  },
  {
    start: "2019",
    end: "2021",
    role: "Front-End Developer",
    company: "Pixel & Pine Studio",
    description:
      "Shipped marketing sites and interactive campaigns for agency clients, with a focus on animation and accessibility.",
    tags: ["JavaScript", "SCSS", "GSAP", "WordPress"],
  },
];
