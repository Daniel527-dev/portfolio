// The work history the site starts with, taken from the resume. Each entry's cover
// is a title card and its references are other designers' work, shown credited and
// linked. Seed images live in public/projects/ and are served as static files; the
// owner's own uploads (including sample images) go through /admin and
// /api/projects/images.

export const SEED_IMAGE_PREFIX = "seed-";

export const seedProjects = [
  {
    title: "Multi-Brand Design System",
    summary:
      "Figma libraries, component standards and documentation for several enterprise brands at RG Pacific. Design tokens from Figma variables feed Tailwind CSS and the React component library, which cut the design-to-engineering cycle by 40%.",
    year: 2025,
    tags: ["Design Systems", "Figma", "Design Tokens", "Tailwind CSS", "React"],
    image: "seed-multi-brand-design-system.png",
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-wise-design-system.gif",
        caption: "Wise multi-brand design system.",
        credit: "Ness Grixti",
        sourceUrl: "https://nessgrixti.com/portfolio/wise-multi-brand/",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-smartmoving-crm.png",
        caption: "SmartMoving B2B SaaS website.",
        credit: "Design Studio UI/UX",
        sourceUrl: "https://www.designstudiouiux.com/case-study/b2b-saas-product-design/",
      },
      {
        image: "seed-ref-clearbit-saas.jpg",
        caption: "Clearbit website redesign.",
        credit: "Ramotion",
        sourceUrl: "https://www.ramotion.com/work/",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-fabiano-norte-app.png",
        caption: "norte, an AI planner app, responsive across laptop and phone.",
        credit: "Fabiano Silva Santos",
        sourceUrl: "https://contra.com/community/PzRfn26w-alguns-dos-meus-trabalhos",
      },
      {
        image: "seed-ref-fabiano-condo-dashboard.png",
        caption: "Condo OS: an operations dashboard with KPIs, charts and pending decisions.",
        credit: "Fabiano Silva Santos",
        sourceUrl: "https://contra.com/community/TFHsgMxo-trabalhos",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-analytics-dashboard.png",
        caption: "Enterprise SaaS analytics dashboard.",
        credit: "Ishita Dey",
        sourceUrl: "https://www.ishitadey.com/work/case-study-enterprise-saas-redesign",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-fabiano-condo-flow.png",
        caption: "Condo OS: a five-step flow from connecting data to better decisions.",
        credit: "Fabiano Silva Santos",
        sourceUrl: "https://contra.com/community/p890ZBed-trabalhos",
      },
      {
        image: "seed-ref-fabiano-bzlimp-system.png",
        caption: "BZ Limp: one visual system across website, dashboard and WhatsApp.",
        credit: "Fabiano Silva Santos",
        sourceUrl: "https://contra.com/community/kmrwdFs7-works",
      },
      {
        image: "seed-ref-fabiano-ache-control-tower.png",
        caption: "Aché logistics control tower: from data visibility to action, with data governance built in.",
        credit: "Fabiano Silva Santos",
        sourceUrl: "https://contra.com/community/gWfYPr2p-trabalhos",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-firefox-posters.jpg",
        caption: "Firefox brand identity posters.",
        credit: "Ramotion",
        sourceUrl: "https://www.ramotion.com/work/",
      },
      {
        image: "seed-ref-descript-poster.jpg",
        caption: "Descript brand identity.",
        credit: "Ramotion",
        sourceUrl: "https://www.ramotion.com/work/",
      },
      {
        image: "seed-ref-wise-platform.png",
        caption: "Wise Platform sub-brand.",
        credit: "Ness Grixti",
        sourceUrl: "https://nessgrixti.com/portfolio/wise-multi-brand/",
      },
      {
        image: "seed-ref-vimeo-reframe.jpg",
        caption: "Vimeo REFRAME identity.",
        credit: "Uncommon Creative Studio",
        sourceUrl: "https://www.printmag.com/advertising/vimeo-reframe-identity-by-uncommon-creative-studio/",
      },
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
    // Other designers' work, shown credited as inspiration, never as Ana's.
    references: [
      {
        image: "seed-ref-lando-norris.webp",
        caption: "Lando Norris official website.",
        credit: "OFF+BRAND",
        sourceUrl: "https://www.itsoffbrand.com/our-work/lando-norris",
      },
      {
        image: "seed-ref-igloo-inc.jpg",
        caption: "Igloo Inc website.",
        credit: "Abeto",
        sourceUrl: "https://www.awwwards.com/sites/igloo-inc",
      },
    ],
    featured: false,
  },
];
