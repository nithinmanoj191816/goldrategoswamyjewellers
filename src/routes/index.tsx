import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, MessageCircle, Phone } from "lucide-react";
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
        <RateCard ref={cardRef} data={data} />

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
