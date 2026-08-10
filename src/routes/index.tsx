import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Eye, MessageCircle, Pencil, Phone, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { RateCard } from "@/components/RateCard";
import { Button } from "@/components/ui/button";
import { SHOP, buildShareText, useRates } from "@/lib/rates";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SM Gold — Today's Gold & Silver Rate | Nellore Jewellers" },
      {
        name: "description",
        content:
          "Daily 22K, 18K, 9K gold and silver rates per gram from SM Gold, Main Road, Chinna Bazar, Nellore. Rates inclusive of GST.",
      },
      { property: "og:title", content: "SM Gold — Today's Gold & Silver Rate" },
      {
        property: "og:description",
        content: "Live daily gold and silver rate card from SM Gold Jewelry Store, Nellore.",
      },
    ],
  }),
  component: PublicRatePage,
});

function PublicRatePage() {
  const { data, hydrated } = useRates();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const share = () => {
    const text = encodeURIComponent(buildShareText(data));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `sm-gold-rate-${data.date}.png`;
      a.click();
      toast.success("Rate card image downloaded.");
    } catch {
      toast.error("Could not create the image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="ivory-canvas min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className={`mx-auto w-full max-w-2xl ${hydrated ? "rise-in" : "opacity-0"}`}>
        {!open ? (
          <section className="rounded-[2px] border border-primary/15 bg-card/70 px-6 py-14 text-center shadow-[0_24px_60px_-40px_rgba(6,78,59,0.5)] sm:px-12 sm:py-20">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/25 bg-primary/5">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-[0.08em] text-primary sm:text-5xl">
              {SHOP.name}
            </h1>
            <p className="mt-3 text-[10px] tracking-[0.4em] text-muted-foreground uppercase sm:text-xs">
              {SHOP.subtitle}
            </p>
            <div className="gold-rule mx-auto mt-8 w-40" />
            <p className="mt-8 text-sm leading-relaxed tracking-[0.14em] text-muted-foreground uppercase">
              See the rates today
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => setOpen(true)}
                className="h-12 rounded-none bg-primary tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5 hover:bg-emerald-mid"
              >
                <Eye className="mr-2 h-4 w-4" /> Open rate card
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-primary/30 bg-transparent tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5 hover:bg-secondary"
              >
                <Link to="/admin">
                  <Pencil className="mr-2 h-4 w-4" /> Add / update rate
                </Link>
              </Button>
            </div>
          </section>
        ) : (
          <>
            <div className="rise-in">
              <RateCard ref={cardRef} data={data} />
            </div>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={share}
            className="h-12 rounded-none bg-primary tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5 hover:bg-emerald-mid"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={download}
            disabled={busy}
            className="h-12 rounded-none border-primary/30 bg-transparent tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5 hover:bg-secondary"
          >
            <Download className="mr-2 h-4 w-4" />
            {busy ? "Preparing…" : "Download card"}
          </Button>
        </div>

        <div className="gold-rule mx-auto mt-12 w-full max-w-md" />

        <footer className="mt-8 text-center">
          <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
            All rates are inclusive of GST
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a
              href={`https://wa.me/${SHOP.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-[0.12em] text-primary uppercase transition-colors hover:text-emerald-mid"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {SHOP.phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-sm tracking-[0.12em] text-primary uppercase transition-colors hover:text-emerald-mid"
              >
                <Phone className="h-4 w-4" /> {p}
              </a>
            ))}
          </div>
          <address className="mt-6 text-xs leading-relaxed tracking-[0.16em] text-muted-foreground uppercase not-italic">
            {SHOP.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-8 font-display text-sm tracking-[0.3em] text-primary/70 uppercase">
            {SHOP.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
