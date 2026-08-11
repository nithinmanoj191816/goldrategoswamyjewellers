import { useCallback, useEffect, useState } from "react";

export const SHOP = {
  name: "GOSWAMY JEWELLERS",
  subtitle: "Jewelry Store",
  monogram: "GJ",
  addressLines: ["6/323 DIAMOND BAZAR", "MACHILIPATNAM, A.P."],
  phones: ["+91 9032963855"],
  whatsapp: "919032963855",
} as const;

export type RateKey = "k22" | "k18" | "k9" | "silver";

export const PURITIES: { key: RateKey; label: string; sub: string; unit: string }[] = [
  { key: "k22", label: "22K", sub: "91.6", unit: "per gram" },
  { key: "k18", label: "18K", sub: "75.0", unit: "per gram" },
  { key: "k9", label: "9K", sub: "37.5", unit: "per gram" },
  { key: "silver", label: "SILVER", sub: "1 GR", unit: "per gram" },
];

export type RateData = {
  date: string; // yyyy-mm-dd
  rates: Record<RateKey, number>;
};

export function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const DEFAULT_RATES: RateData = {
  date: todayISO(),
  rates: { k22: 14348, k18: 11739, k9: 6706, silver: 244 },
};

const STORAGE_KEY = "sm-gold-rates-v1";

function parse(raw: string | null): RateData | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as RateData;
    if (!v || typeof v.date !== "string" || !v.rates) return null;
    for (const p of PURITIES) {
      if (typeof v.rates[p.key] !== "number" || !isFinite(v.rates[p.key])) return null;
    }
    return v;
  } catch {
    return null;
  }
}

export function readRates(): RateData {
  if (typeof window === "undefined") return DEFAULT_RATES;
  const stored = parse(window.localStorage.getItem(STORAGE_KEY));
  if (!stored) return { ...DEFAULT_RATES, date: todayISO() };
  // Date always follows the current day unless the owner set a future date.
  const today = todayISO();
  return { ...stored, date: stored.date > today ? stored.date : today };
}


const EVENT = "sm-gold-rates-change";

export function useRates() {
  const [data, setData] = useState<RateData>(DEFAULT_RATES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(readRates());
    setHydrated(true);
    const sync = () => setData(readRates());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((next: RateData) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    setData(next);
  }, []);

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT));
    setData(DEFAULT_RATES);
  }, []);

  return { data, hydrated, save, reset };
}

export function formatRupees(value: number, minDecimals = 0) {
  return `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

export function formatLongDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

export function buildShareText(data: RateData) {
  const lines = PURITIES.map(
    (p) =>
      `${p.label} ${p.sub} — ${formatRupees(data.rates[p.key], p.key === "silver" ? 2 : 0)} / gram`,
  );
  return [
    `*${SHOP.name}* — ${SHOP.subtitle}`,
    `Today's Rate · ${formatLongDate(data.date)}`,
    "",
    ...lines,
    "",
    "All rates are inclusive of GST",
    SHOP.addressLines.join(", "),
    SHOP.phones.join(" / "),
  ].join("\n");
}
