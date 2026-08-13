import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { RateCard } from "@/components/RateCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PURITIES, formatLongDate, formatRupees, type RateKey, useRates } from "@/lib/rates";

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
  console.log("DBG AdminPage render");
  const { data, hydrated, save, reset } = useRates();
  const [values, setValues] = useState<FormValues>({
    date: data.date,
    k22: String(data.rates.k22),
    k18: String(data.rates.k18),
    k9: String(data.rates.k9),
    silver: String(data.rates.silver),
  });
  const [errors, setErrors] = useState<Errors>({});
  const [confirm, setConfirm] = useState<null | {
    date: string;
    rates: Record<RateKey, number>;
    bigJumps: string[];
  }>(null);

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
    const nextRates = {
      k22: Number(parsed.data.k22),
      k18: Number(parsed.data.k18),
      k9: Number(parsed.data.k9),
      silver: Number(parsed.data.silver),
    } as Record<RateKey, number>;

    const bigJumps = PURITIES.filter((p) => {
      const old = data.rates[p.key];
      if (!old) return false;
      return Math.abs(nextRates[p.key] - old) / old > 0.1;
    }).map(
      (p) =>
        `${p.label} ${p.sub}: ${formatRupees(data.rates[p.key], p.key === "silver" ? 2 : 0)} → ${formatRupees(nextRates[p.key], p.key === "silver" ? 2 : 0)}`,
    );

    setConfirm({ date: parsed.data.date, rates: nextRates, bigJumps });
  };

  const applySave = () => {
    if (!confirm) return;
    save({ date: confirm.date, rates: confirm.rates });
    setConfirm(null);
    toast.success("Rates updated successfully.");
  };


  return (
    <main className="ivory-canvas min-h-screen px-4 py-10">
      <p>TEST FORM SUBMIT</p>
      <form onSubmit={onSubmit} noValidate>
        <Button type="submit">Save</Button>
      </form>
    </main>
  );
}
