"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { calculateDemoQuote, demoCoupons, demoVehicles, formatRupees } from "@/lib/bookingDemo";

const fieldClass = "mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-amber-600";
const initial = { vehicleId: "city", rentalType: "day", duration: "2", couponId: "none" };

export default function BookingPlayground() {
  const [options, setOptions] = useState(initial);
  const quote = calculateDemoQuote(options);
  const update = (key, value) => setOptions((previous) => ({ ...previous, [key]: value }));
  const hourly = options.rentalType === "hour";

  return (
    <section id="playground" className="scroll-mt-24 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <SectionHeading eyebrow="Try the logic" title="Take the booking logic for a spin." />
          <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">Explore the pricing rules behind my car-rental project. Change a rental, apply a coupon, and see how the quote comes together.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <h3 className="font-semibold">Booking quote playground</h3>
            <span className="rounded-full bg-amber-100 dark:bg-yellow-400/10 px-3 py-1 text-sm font-medium text-amber-900 dark:text-yellow-400">Interactive demo · sample rates</span>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="space-y-6 p-6 md:p-8">
              <label className="block text-sm font-medium" htmlFor="demo-vehicle">Vehicle
                <select id="demo-vehicle" className={`portfolio-select ${fieldClass}`} value={options.vehicleId} onChange={(event) => update("vehicleId", event.target.value)}>
                  {demoVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · {formatRupees(vehicle.daily)}/day</option>)}
                </select>
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Rental type</legend>
                <div className="grid grid-cols-3 gap-2">
                  {[["day", "Daily"], ["hour", "Hourly"], ["airport", "Airport"]].map(([value, label]) => (
                    <label key={value} className={`relative cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold ${options.rentalType === value ? "border-amber-600 bg-amber-50 text-amber-900 dark:border-yellow-400 dark:bg-yellow-400/10 dark:text-yellow-400" : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"}`}>
                      <input type="radio" name="demo-rental" value={value} checked={options.rentalType === value} onChange={() => update("rentalType", value)} className="peer sr-only" />
                      <span className="peer-focus-visible:underline peer-focus-visible:underline-offset-4">{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {options.rentalType !== "airport" ? (
                <label htmlFor="demo-duration" className="block text-sm font-medium">{hourly ? "Hours" : "Days"}
                  <input id="demo-duration" type="number" inputMode="numeric" min="1" max={hourly ? 24 : 30} step="1" value={options.duration} onChange={(event) => update("duration", event.target.value)} aria-invalid={!quote} aria-describedby={!quote ? "demo-error" : undefined} className={fieldClass} />
                </label>
              ) : <p className="rounded-xl bg-zinc-50 dark:bg-zinc-950 p-4 text-base text-zinc-600 dark:text-zinc-400">Airport transfer: a flat 40% of the daily rate for a transfer within 24 hours.</p>}
              <label htmlFor="demo-coupon" className="block text-sm font-medium">Coupon
                <select id="demo-coupon" value={options.couponId} onChange={(event) => update("couponId", event.target.value)} className={`portfolio-select ${fieldClass}`}>
                  {Object.entries(demoCoupons).map(([id, coupon]) => <option key={id} value={id}>{coupon.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => setOptions(initial)} className="min-h-11 text-sm font-semibold text-zinc-600 underline underline-offset-4 hover:text-black dark:text-zinc-400 dark:hover:text-white">Reset demo</button>
            </div>
            <div className="flex flex-col border-t border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-8 lg:border-l lg:border-t-0" aria-live="polite" aria-atomic="true">
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Your sample quote</p>
              {quote ? <>
                <dl className="space-y-4 text-base">
                  {[["Rental subtotal", quote.base], ["Coupon discount", quote.discount ? -quote.discount : 0], ["GST · 18% after discount", quote.tax], ["Security deposit", quote.deposit]].map(([label, amount]) => (
                    <div key={label} className="flex justify-between gap-4"><dt className="text-zinc-600 dark:text-zinc-400">{label}</dt><dd className="shrink-0 font-mono font-medium">{formatRupees(amount)}</dd></div>
                  ))}
                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6"><dt className="font-semibold">Total</dt><dd className="text-3xl font-bold tracking-tight text-amber-700 dark:text-yellow-400" data-testid="quote-total">{formatRupees(quote.total)}</dd></div>
                </dl>
                <p className="mt-6 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{hourly ? "The hourly rate uses the daily rate divided by 8, rounded to the nearest rupee." : "Discounts apply before tax and cannot exceed the rental subtotal."}</p>
              </> : <p id="demo-error" role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-base text-amber-900 dark:border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-200">Enter a whole number from 1 to {hourly ? 24 : 30} {hourly ? "hours" : "days"} to calculate a quote.</p>}
              <div className="mt-auto pt-10">
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">Runs in your browser with illustrative prices. No booking or payment is created.</p>
                <Link href="/projects/car-rental#case-study" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-amber-800 underline underline-offset-4 dark:text-yellow-400">Read the engineering case study</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
