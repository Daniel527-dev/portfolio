// Everything personal about the site lives here. Swap these values for your own
// details and the whole site (header, hero, about page, footer, RSS, metadata) follows.
// The project history is not here: it's stored in the database and managed at /admin
// (the starting entries come from src/lib/seed-projects.ts).

export const site = {
  name: "Ana Gutierrez Rubio",
  shortName: "Ana",
  role: "Senior UI/UX Designer & Design Technologist",
  tagline: "I design product interfaces and brand systems, then build them in React.",
  description:
    "Portfolio and articles by Ana Gutierrez Rubio, a senior UI/UX designer and design technologist working across product design, brand systems, design tokens and front-end engineering.",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  email: "ana.rubio.dev@gmail.com",
  location: "Oviedo, Florida",
  socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/ana-rubio-121247290" }],
  nav: [
    { label: "Articles", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const categories = [
  { slug: "design-systems", label: "Design Systems" },
  { slug: "ui-design", label: "UI Design" },
  { slug: "brand", label: "Brand" },
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
    start: "2021",
    end: "2026",
    role: "Lead Brand & Web Experience Designer / Design Technologist",
    company: "RG Pacific LLC",
    description:
      "Led brand identity and responsive web redesigns for 25+ enterprise clients. Built multi-brand Figma design systems and linked their tokens to Tailwind CSS and React, cutting the design-to-engineering cycle by 40%. Raised conversion by 38% and engagement by 44% through better flows and A/B testing, and mentored four designers.",
    tags: ["Design Systems", "Brand Identity", "React", "Next.js", "A/B Testing"],
  },
  {
    start: "2020",
    end: "2021",
    role: "Senior UI/UX Designer & Front-End Engineer",
    company: "Supplyframe (Siemens Digital Platform)",
    description:
      "Redesigned data-visualization dashboards and parametric search used by 10M+ hardware engineers. Built reusable React and TypeScript components that cut time-to-task by 32%, and automated a design token workflow from Figma to Git packages.",
    tags: ["Dashboards", "React", "TypeScript", "Design Tokens"],
  },
  {
    start: "2018",
    end: "2020",
    role: "Senior Product Designer / Brand Designer",
    company: "Tack Media",
    description:
      "Built brand systems (type, color, iconography, voice) and carried them through product interfaces, websites and campaigns. Designed UI kits and conversion-focused landing pages, with a 98% first-round prototype approval rate.",
    tags: ["Brand Systems", "Product Design", "UI Kits", "Landing Pages"],
  },
  {
    start: "2016",
    end: "2018",
    role: "Interactive UI/UX Designer & Creative Technologist",
    company: "Ayzenberg Group",
    description:
      "Designed interactive web experiences and campaigns for Microsoft, Xbox and Warner Bros. Interactive, prototyping motion in WebGL, Canvas and CSS. Contributed to work recognized with three ADDY and Davey awards.",
    tags: ["WebGL", "Canvas", "Motion", "Campaigns"],
  },
];

// Headline numbers on the home page; they count up as they scroll into view.
export const highlights = [
  { value: 10, prefix: "", suffix: "+", label: "years designing and building for the web" },
  { value: 25, prefix: "", suffix: "+", label: "enterprise brand & web redesigns" },
  { value: 10, prefix: "", suffix: "M+", label: "engineers using dashboards I redesigned" },
  { value: 38, prefix: "+", suffix: "%", label: "lift in web conversion" },
];
