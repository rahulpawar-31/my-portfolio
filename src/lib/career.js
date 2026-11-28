// Career evidence shown on the portfolio: work experience, selected pull
// requests, verified results, testimonials and project screenshots.
//
// Only add facts you can back up. Every empty field or list is hidden on the
// site, so a section appears only once it has real content.

export const experience = [
  {
    company: "Webby Wonder",
    role: "Junior Web Developer Intern",
    // Fill in when known, e.g. "Jun 2026 – Present". Hidden while null.
    period: null,
    current: true,
    products: [
      {
        name: "CountryStateCity",
        desc: "An established developer API with a large user base.",
        url: null,
      },
      {
        name: "MakeMySiteLive",
        desc: "A static-site hosting and deployment platform.",
        url: null,
      },
    ],
    // What you personally built, one line each.
    // e.g. "Built the site moderation queue in MakeMySiteLive's admin panel."
    contributions: [],
    // Outcomes you can support. Use numbers only when you can prove them.
    // e.g. { value: "40%", label: "faster API responses on the search endpoint" }
    results: [],
    // Two or three strong PRs.
    // { title, url, problem, solution }
    pullRequests: [],
  },
];

// Short quotes from a supervisor or collaborator, shared with their permission.
// { quote, name, role, company }
export const testimonials = [];

// Per-project evidence, keyed by the project's slug in the database.
// {
//   screenshots: [{ src: "/screenshots/car-rental-home.png", alt, caption, width, height }],
//   contribution: { built, hardestProblem, approach },
// }
// Put image files in public/screenshots/.
export const projectShowcase = {};
