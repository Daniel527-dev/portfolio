// The work history the site starts with, taken from the resume. Each entry's cover
// is a title card and its samples are labeled concept illustrations, all in
// public/projects/ (seed images are served as static files, uploads go through
// /api/projects/images). Edit, replace or delete them at /admin.

export const SEED_IMAGE_PREFIX = "seed-";

export const seedProjects = [
  {
    title: "Multi-Brand Design System",
    summary:
      "Figma libraries, component standards and documentation for several enterprise brands at RG Pacific. Design tokens from Figma variables feed Tailwind CSS and the React component library, which cut the design-to-engineering cycle by 40%.",
    year: 2025,
    tags: ["Design Systems", "Figma", "Design Tokens", "Tailwind CSS", "React"],
    image: "seed-multi-brand-design-system.png",
    samples: [
      { image: "seed-sample-multi-brand-design-system-1.png", caption: "Token sheet: one semantic layer, three brand modes. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-multi-brand-design-system-2.png", caption: "The same components themed for three brands. Concept illustration, not the original client deliverable." },
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
      { image: "seed-sample-enterprise-brand-web-redesigns-1.png", caption: "Responsive landing page, desktop and mobile. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-enterprise-brand-web-redesigns-2.png", caption: "Stakeholder workshop: brand strategy board. Concept illustration, not the original client deliverable." },
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
    samples: [
      { image: "seed-sample-production-ui-react-nextjs-1.png", caption: "A React component in code and in the browser. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-production-ui-react-nextjs-2.png", caption: "Accessible form states specified before build. Concept illustration, not the original client deliverable." },
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
    samples: [
      { image: "seed-sample-parametric-search-dashboards-1.png", caption: "Parametric search with filters and a results table. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-parametric-search-dashboards-2.png", caption: "Supply dashboard with a part inspection panel. Concept illustration, not the original client deliverable." },
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
      { image: "seed-sample-figma-to-git-token-pipeline-1.png", caption: "Pipeline from Figma variables to shipped code. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-figma-to-git-token-pipeline-2.png", caption: "tokens.json in, CSS and Tailwind out. Concept illustration, not the original client deliverable." },
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
      { image: "seed-sample-brand-systems-digital-products-1.png", caption: "Brand style sheet: mark, type, color, icons and voice. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-brand-systems-digital-products-2.png", caption: "The brand applied to app, business card and social. Concept illustration, not the original client deliverable." },
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
      { image: "seed-sample-interactive-campaigns-1.png", caption: "Storyboard from campaign story to interaction. Concept illustration, not the original client deliverable." },
      { image: "seed-sample-interactive-campaigns-2.png", caption: "Motion spec: timing, easing and triggers per layer. Concept illustration, not the original client deliverable." },
    ],
    featured: false,
  },
];
