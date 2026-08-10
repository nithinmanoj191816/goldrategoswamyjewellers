import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { RateCard } from "@/components/RateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PURITIES, type RateKey, useRates } from "@/lib/rates";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Manage Rates — SM Gold" },
      { name: "description", content: "Update the daily gold and silver rates for SM Gold." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Manage Rates — SM Gold" },
      { property: "og:description", content: "Internal rate management for SM Gold." },
    ],
  }),
  component: AdminPage,
});

const rateSchema = z
  .string()
  .trim()
  .min(1, "Enter a rate")
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Use digits only, up to 2 decimals")
  .refine((v) => Number(v) > 0, "Rate must be greater than zero")
  .refine((v) => Number(v) <= 1_000_000, "Rate looks too high");

const formSchema = z.object({
  date: z
    .string()
    .min(1, "Choose a date")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Enter a valid date"),
  k22: rateSchema,
  k18: rateSchema,
  k9: rateSchema,
  silver: rateSchema,
});

type FormValues = z.infer<typeof formSchema>;
type Errors = Partial<Record<keyof FormValues, string>>;

function AdminPage() {
  const { data, hydrated, save, reset } = useRates();
  const [values, setValues] = useState<FormValues>({
    date: data.date,
    k22: String(data.rates.k22),
    k18: String(data.rates.k18),
    k9: String(data.rates.k9),
    silver: String(data.rates.silver),
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!hydrated) return;
    setValues({
      date: data.date,
      k22: String(data.rates.k22),
      k18: String(data.rates.k18),
      k9: String(data.rates.k9),
      silver: String(data.rates.silver),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const preview = {
    date: values.date || data.date,
    rates: PURITIES.reduce(
      (acc, p) => {
        const n = Number(values[p.key]);
        acc[p.key] = Number.isFinite(n) && n > 0 ? n : data.rates[p.key];
        return acc;
      },
      {} as Record<RateKey, number>,
    ),
  };

  const set = (key: keyof FormValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please correct the highlighted fields.");
      return;
    }
    save({
      date: parsed.data.date,
      rates: {
        k22: Number(parsed.data.k22),
        k18: Number(parsed.data.k18),
        k9: Number(parsed.data.k9),
        silver: Number(parsed.data.silver),
      },
    });
    toast.success("Rates updated successfully.");
  };

  return (
    <main className="ivory-canvas min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.34em] text-muted-foreground uppercase">
              SM Gold · Internal
            </p>
            <h1 className="mt-2 truncate font-display text-3xl font-semibold tracking-[0.06em] text-primary sm:text-4xl">
              Manage Rates
            </h1>
          </div>
          <Button asChild variant="ghost" className="shrink-0 rounded-none uppercase">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Rate card
            </Link>
          </Button>
        </header>

        <div className="gold-rule mt-6" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <form onSubmit={onSubmit} noValidate className="space-y-7">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[11px] tracking-[0.24em] uppercase">
                Rate date
              </Label>
              <Input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => set("date", e.target.value)}
                aria-invalid={!!errors.date}
                className="h-12 rounded-none border-input bg-card"
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-5">
              {PURITIES.map((p) => (
                <div key={p.key} className="space-y-2">
                  <Label htmlFor={p.key} className="text-[11px] tracking-[0.24em] uppercase">
                    {p.label} {p.sub}{" "}
                    <span className="text-muted-foreground normal-case">(fixed category)</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      id={p.key}
                      inputMode="decimal"
                      value={values[p.key]}
                      onChange={(e) => set(p.key, e.target.value)}
                      aria-invalid={!!errors[p.key]}
                      className="h-12 rounded-none border-input bg-card pr-20 pl-9 tabular-nums"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      / gram
                    </span>
                  </div>
                  {errors[p.key] && <p className="text-xs text-destructive">{errors[p.key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                className="h-12 rounded-none tracking-[0.18em] uppercase hover:bg-emerald-mid"
              >
                <Check className="mr-2 h-4 w-4" /> Save &amp; publish
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  toast.success("Restored the default rates.");
                }}
                className="h-12 rounded-none border-primary/30 bg-transparent tracking-[0.18em] uppercase"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset to defaults
              </Button>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Purity categories are fixed and cannot be edited. Saved rates are stored on this
              device and appear instantly on the public rate card.
            </p>
          </form>

          <div>
            <p className="mb-4 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Live preview
            </p>
            <RateCard data={preview} />
          </div>
        </div>
      </div>
    </main>
  );
}
