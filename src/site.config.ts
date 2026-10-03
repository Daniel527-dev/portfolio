// Everything personal about the site lives here. Swap these values for your own
// details and the whole site (header, hero, about page, footer, RSS, metadata) follows.
// The project history is not here: it's stored in the database and managed at /admin.

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
