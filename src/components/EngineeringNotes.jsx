import SectionHeading from "@/components/SectionHeading";
import { externalLinkProps, socials } from "@/lib/site";

const notes = [
  {
    title: "One price, wherever you book",
    topic: "Backend design",
    summary: "Why booking, rescheduling, and coupon previews should share one calculation.",
    paragraphs: [
      "Duplicated pricing logic is easy to miss during development: a preview looks right, a booking looks right, but they disagree when a customer chooses an hourly rental or applies a large coupon.",
      "The car-rental project moves the arithmetic into a pure function that accepts the car, rental type, dates, and validated coupon. Each caller uses the same output. Database lookups and coupon redemption stay outside the calculation.",
      "That boundary makes the rules easier to test. The playground on this page demonstrates daily, hourly, and airport pricing with illustrative data.",
    ],
    source: `${socials.github}/car-rental/blob/main/api/src/services/booking.quote.js`,
    sourceLabel: "Read the pricing code",
  },
  {
    title: "A database connection can wait",
    topic: "Next.js + Prisma",
    summary: "Keeping an import from becoming a database dependency during a build.",
    paragraphs: [
      "Creating a Prisma client at module scope ties every import of that module to its environment configuration. A build that imports a page can fail before a visitor ever requests database-backed content.",
      "This portfolio initializes its Prisma client when code first accesses it. The client is cached for reuse, and a missing DATABASE_URL produces a clear query-time error.",
      "This does not make database queries work without a database. It separates module loading from connecting, and the project list handles a failed query with an unavailable state.",
    ],
    source: `${socials.github}/my-portfolio/blob/main/src/lib/prisma.js`,
    sourceLabel: "Read the Prisma setup",
  },
  {
    title: "Keep the interactive boundary small",
    topic: "React architecture",
    summary: "Fetch projects on the server; filter the resulting cards in the browser.",
    paragraphs: [
      "Project data belongs on the server, where the database client and credentials stay. Filtering belongs in the browser, where a visitor can change a category or technology without waiting for a new request.",
      "The server component fetches projects and passes just the fields the cards need into a client component. Category and technology filters work together, and a clear action resets an empty combination.",
      "This keeps interactive state close to the controls while leaving database access outside the client bundle.",
    ],
    source: `${socials.github}/my-portfolio/blob/main/src/components/Project.jsx`,
    sourceLabel: "Read the project component",
  },
];

export default function EngineeringNotes() {
  return (
    <section id="notes" className="scroll-mt-24 bg-white px-6 py-24 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <SectionHeading eyebrow="From the workbench" title="Engineering notes" />
          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">Small decisions behind the projects. What the code does, why it is structured that way, and where the tradeoffs are.</p>
        </div>
        <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {notes.map((note) => <details key={note.title} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-2 [&::-webkit-details-marker]:hidden">
              <div><p className="mb-2 text-sm font-medium text-amber-700 dark:text-yellow-400">{note.topic}</p><h3 className="text-xl font-semibold tracking-tight">{note.title}</h3><p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{note.summary}</p></div>
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-lg dark:border-zinc-700"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
            </summary>
            <div className="mt-5 max-w-3xl space-y-4 pb-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {note.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a href={note.source} {...externalLinkProps} className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-800 underline underline-offset-4 dark:text-yellow-400">{note.sourceLabel}<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </details>)}
        </div>
      </div>
    </section>
  );
}
