import { forwardRef } from "react";
import {
  PURITIES,
  SHOP,
  formatLongDate,
  formatRupees,
  type RateData,
} from "@/lib/rates";

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 bg-gold/45 sm:w-20" />
      <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true">
        <path
          d="M13 1l3 4-3 4-3-4 3-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          className="text-gold"
        />
        <circle cx="2" cy="5" r="1" className="fill-gold/70" />
        <circle cx="24" cy="5" r="1" className="fill-gold/70" />
      </svg>
      <span className="h-px w-12 bg-gold/45 sm:w-20" />
    </div>
  );
}

type Props = { data: RateData };

export const RateCard = forwardRef<HTMLDivElement, Props>(function RateCard({ data }, ref) {
  return (
    <div
      ref={ref}
      className="card-emerald relative overflow-hidden rounded-[2px] p-[10px] shadow-[0_30px_70px_-30px_rgba(6,78,59,0.55)]"
    >
      {/* double gold frame */}
      <div className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-gold/45" />
      <div className="pointer-events-none absolute inset-[14px] rounded-[2px] border border-gold/20" />

      <div className="relative px-4 py-8 sm:px-10 sm:py-12">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/60 bg-[oklch(0.28_0.06_165)] shadow-[inset_0_0_18px_rgba(201,168,76,0.25)]">
            <span className="font-display text-2xl tracking-[0.08em] gold-text">
              {SHOP.monogram}
            </span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-none font-semibold tracking-[0.14em] gold-text sm:text-5xl">
            {SHOP.name}
          </h1>
          <p className="mt-3 text-[10px] tracking-[0.42em] text-ivory/70 uppercase sm:text-xs">
            {SHOP.subtitle}
          </p>
          <Ornament className="mt-6" />
        </header>

        {/* Date */}
        <div className="mt-6 text-center">
          <h2 className="font-display text-xl font-medium tracking-[0.18em] text-ivory/90 uppercase sm:text-2xl">
            Today&apos;s Gold Rate
          </h2>
          <p className="mt-3 inline-block border border-gold/35 px-4 py-1.5 text-[11px] tracking-[0.3em] text-gold-soft uppercase sm:text-xs">
            {formatLongDate(data.date)}
          </p>
        </div>

        {/* Rates */}
        <ul className="mt-8 space-y-px">
          {PURITIES.map((p, i) => (
            <li
              key={p.key}
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-4 transition-colors sm:px-5 ${
                i === 0
                  ? "border-y border-gold/35 bg-[oklch(0.99_0.01_88_/_0.07)]"
                  : "border-b border-gold/15 hover:bg-[oklch(0.99_0.01_88_/_0.04)]"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`font-display leading-none tracking-[0.12em] text-ivory ${
                    i === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {p.label}
                </p>
                <p className="mt-1.5 text-[10px] tracking-[0.28em] text-gold-soft/80 uppercase">
                  {p.sub}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`font-display leading-none font-semibold [font-variant-numeric:lining-nums_tabular-nums] gold-text ${
                    i === 0 ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                  }`}
                >
                  {formatRupees(data.rates[p.key], p.key === "silver" ? 2 : 0)}
                </p>
                <p className="mt-1.5 text-[10px] tracking-[0.24em] text-ivory/55 uppercase">
                  {p.unit}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Ornament className="mt-8" />

        {/* Shop details */}
        <footer className="mt-6 text-center text-[11px] leading-relaxed tracking-[0.16em] text-ivory/70 uppercase">
          {SHOP.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="mt-3 tracking-[0.2em] text-gold-soft">{SHOP.phones.join("  ·  ")}</p>
          <p className="mt-4 text-[10px] tracking-[0.24em] text-ivory/50">
            All rates are inclusive of GST
          </p>
        </footer>
      </div>
    </div>
  );
});
