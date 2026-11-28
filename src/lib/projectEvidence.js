// Keep these notes tied to public source. Demo screenshots are captured from
// the public apps; sample pricing in the playground is illustrative.
const github = "https://github.com/rahulpawar-31";

export const projectEvidence = {
  "car-rental": {
    category: "Full stack",
    featuredOrder: 1,
    screenshots: [{
      src: "/screenshots/car-rental.png",
      alt: "DriveEase car rental public home page",
      caption: "DriveEase · public demo",
      width: 1440,
      height: 900,
    }],
    caseStudy: {
      title: "Keeping a booking quote consistent",
      summary: "A rental price has to mean the same thing in a coupon preview, a new booking, and a reschedule.",
      problem: "Separate pricing calculations had drifted apart. Coupon previews assumed daily rentals, while flat discounts were not consistently capped at the rental price.",
      decisions: [
        { title: "One calculation, three callers", description: "A pure computeBookingQuote function owns the base price, discount, tax, and total. Booking creation, rescheduling, and coupon previews use that same calculation." },
        { title: "Make rental types explicit", description: "Daily rentals use the number of days. Hourly rentals use an hourly rate, with a fallback derived from the daily rate. Airport transfers use a flat fraction of the daily price." },
        { title: "Keep side effects outside pricing", description: "The calculation receives a car and a validated coupon. It does not access the database or claim a coupon, so pricing can be checked independently of payments and persistence." },
      ],
      architecture: [
        { title: "React storefront", detail: "Choose a vehicle, rental type, and dates." },
        { title: "Express API", detail: "Validate the request and resolve the car and coupon." },
        { title: "Shared quote function", detail: "Calculate the base price, discount, tax, and total." },
        { title: "Booking & payment", detail: "Store the quote and continue to Razorpay checkout." },
      ],
      outcome: "All three flows now use the same pricing rules. The portfolio playground below lets you explore those rules with sample rates, without creating a booking.",
      limitation: "Coupon restrictions by car and car type are a documented follow-up in the pricing source. This case study does not claim those restrictions are enforced.",
      sources: [
        { label: "Read the pricing implementation", url: `${github}/car-rental/blob/main/api/src/services/booking.quote.js` },
        { label: "Explore the project documentation", url: `${github}/car-rental#booking--payment-flow` },
      ],
      playground: true,
    },
  },
  "personal-ai": { category: "Full stack", screenshots: [{ src: "/screenshots/personal-ai.png", alt: "Dayhand personal AI public sign-in page", caption: "Personal AI / Dayhand · public sign-in page", width: 1440, height: 900 }] },
  "payload-ecommerce": { category: "Full stack", screenshots: [{ src: "/screenshots/payload-ecommerce.png", alt: "Payload ecommerce public storefront", caption: "Payload Ecommerce · public storefront", width: 1440, height: 900 }] },
  "portfolio-website": {
    category: "Full stack",
    featuredOrder: 2,
    screenshots: [{ src: "/screenshots/portfolio-website.png", alt: "Rahul developer portfolio home page", caption: "This portfolio · home page", width: 1440, height: 900 }],
    caseStudy: {
      title: "A portfolio with a real backend",
      summary: "The contact form, project data, and view counter make this site a small full stack application.",
      problem: "A portfolio needs to show the work clearly while handling real data, message delivery, and deployment failures.",
      decisions: [
        { title: "Fetch projects on the server", description: "The project list reads PostgreSQL through Prisma in a Server Component. Only filtering and other interactive controls run in the browser." },
        { title: "Create the database client on demand", description: "Prisma initialization is deferred until a query runs. A missing database URL does not crash a module import during a build." },
        { title: "Keep project explanations local", description: "Screenshots and case studies live in versioned files, so they can be reviewed with the code and remain available when a GitHub README request fails." },
      ],
      architecture: [
        { title: "Next.js", detail: "Server-rendered project pages and interactive React components." },
        { title: "Route handlers", detail: "Contact submissions and project view counts." },
        { title: "Prisma + Neon", detail: "PostgreSQL persistence through the Neon driver adapter." },
        { title: "Resend", detail: "Email notifications for contact messages." },
      ],
      outcome: "Visitors can explore the implementation through the existing How this works mode and inspect the source behind each feature.",
      sources: [{ label: "Explore the portfolio source", url: `${github}/my-portfolio` }],
    },
  },
  "library-management-system": {
    category: "Backend",
    screenshots: [],
    endpoints: [
      { method: "GET", path: "/api/v1/books" },
      { method: "POST", path: "/api/v1/books" },
      { method: "GET", path: "/api/v1/authors" },
    ],
  },
};

export function projectCategory(project) {
  return projectEvidence[project.slug]?.category ?? "Other";
}
