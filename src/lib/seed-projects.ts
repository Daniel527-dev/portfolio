// The work history the site starts with, taken from the resume: a cover per project
// and, for some, Ana's own sample images. Seed images live in public/projects/ and
// are served as static files; uploads go through /admin and /api/projects/images.

export const SEED_IMAGE_PREFIX = "seed-";

export const seedProjects = [
  {
    title: "Multi-Brand Design System",
    summary:
      "Figma libraries, component standards and documentation for several enterprise brands at RG Pacific. Design tokens from Figma variables feed Tailwind CSS and the React component library, which cut the design-to-engineering cycle by 40%.",
    year: 2025,
    tags: ["Design Systems", "Figma", "Design Tokens", "Tailwind CSS", "React"],
    image: "seed-multi-brand-design-system.png",
    // Ana's own work.
    samples: [
      { image: "seed-sample-harbor-roast-logo.png", caption: "Harbor Roast: logo for a neighborhood café." },
    ],
    featured: true,
  },
  {
    title: "Enterprise Brand & Web Redesigns",
    summary:
      "Brand identity and responsive website redesigns for 25+ enterprise clients, each starting with stakeholder workshops on strategy, success metrics and phasing. Improved flows and A/B testing raised conversion by 38% and engagement by 44%.",
    year: 2024,
    tags: ["Brand Identity", "Web Design", "A/B Testing", "Workshops"],
    image: "seed-enterprise-brand-web-redesigns.png",
    samples: [
      { image: "seed-Enterprise Brand.png", caption: "Garagemax: brand and social media kit for an automotive service." },
      { image: "seed-web Redesign.png", caption: "Acouire: website call-to-action and footer redesign." },
    ],
    featured: true,
  },
  {
    title: "Production UI in React & Next.js",
    summary:
      "Production interfaces built with React, TypeScript, Next.js, Tailwind CSS and Framer Motion, with sub-second responses on critical paths and WCAG 2.1 AA criteria for semantic HTML, keyboard access and cross-browser support.",
    year: 2023,
    tags: ["React", "TypeScript", "Next.js", "Accessibility", "Core Web Vitals"],
    image: "seed-production-ui-react-nextjs.png",
    // Ana's own work.
    samples: [
      { image: "seed-sample-museoarte-exhibition-site.png", caption: "MuseoArte: website for a contemporary art museum." },
      { image: "seed-sample-luma-ecommerce-site.png", caption: "Luma: e-commerce storefront for a fashion and lifestyle brand." },
    ],
    featured: false,
  },
  {
    title: "Parametric Search & Data Dashboards",
    summary:
      "Redesigned data-visualization dashboards and parametric search at Supplyframe, used by 10M+ hardware engineers and buyers: data tables, interactive charts, advanced filters and inspection panels. Reusable React components cut time-to-task by 32%.",
    year: 2020,
    tags: ["UI Design", "Dashboards", "Data Visualization", "React"],
    image: "seed-parametric-search-dashboards.png",
    // Ana's own work.
    samples: [
      { image: "seed-research.png", caption: "Nexora: AI-powered analytics dashboard concept." },
      { image: "seed-data Dashboard.png", caption: "Healthcare appointment dashboard concept." },
    ],
    featured: true,
  },
  {
    title: "Figma-to-Git Token Pipeline",
    summary:
      "An automated design token workflow linking Figma variables to Git-based component packages, so one source of truth kept design and code consistent across platforms.",
    year: 2020,
    tags: ["Design Tokens", "Figma", "Git", "Automation"],
    image: "seed-figma-to-git-token-pipeline.png",
    samples: [
      { image: "seed-Figma.png", caption: "B2B lead generation banner." },
      { image: "seed-pipeline.png", caption: "Aesthetics and med spa lead research banner." },
    ],
    featured: false,
  },
  {
    title: "Brand Systems for Digital Products",
    summary:
      "Complete brand systems at Tack Media (typography, color, iconography, visual language and voice) carried through product UI, responsive websites and campaigns, with reusable UI kits and a 98% first-round prototype approval rate.",
    year: 2019,
    tags: ["Brand Systems", "Typography", "UI Kits", "Landing Pages"],
    image: "seed-brand-systems-digital-products.png",
    samples: [
      { image: "seed-digital products.png", caption: "Pixie.fun: fantasy sports app." },
      { image: "seed-digital Marketing.png", caption: "Digital marketing agency landing page." },
    ],
    featured: false,
  },
  {
    title: "Interactive Campaigns for Microsoft, Xbox & WB",
    summary:
      "Interactive web campaigns at Ayzenberg Group for Microsoft, Xbox and Warner Bros. Interactive, from storyboards and user flows to WebGL, Canvas and CSS motion prototypes. Contributed to work recognized with three ADDY and Davey awards.",
    year: 2017,
    tags: ["Interactive", "WebGL", "Motion", "Storyboards"],
    image: "seed-interactive-campaigns.png",
    samples: [
      { image: "seed-interactive Campaign2.png", caption: "Interactive mobile campaign concept." },
      { image: "seed-interactive Campaign.png", caption: "Social media design showcase." },
    ],
    featured: false,
  },
];
