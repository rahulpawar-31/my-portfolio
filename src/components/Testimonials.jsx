import { testimonials as defaultTestimonials } from "@/lib/career";

export default function Testimonials({ items = defaultTestimonials, className = "" }) {
  if (!items?.length) return null;

  return (
    <section aria-labelledby="testimonials-heading" className={className}>
      <h2 id="testimonials-heading" className="text-2xl font-semibold mb-6">
        What people say
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <figure
            key={`${item.name}-${item.quote.slice(0, 20)}`}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6"
          >
            <blockquote className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-zinc-900 dark:text-white">{item.name}</span>
              {(item.role || item.company) && (
                <span className="text-zinc-500 dark:text-zinc-400">
                  {" · "}
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
