import { createFileRoute } from "@tanstack/react-router";
import { Phone, Shield, Zap, Droplet, Building2, Flame } from "lucide-react";

export const Route = createFileRoute("/hotlines")({
  head: () => ({ meta: [{ title: "Hotlines · CivicLink" }] }),
  component: HotlinesPage,
});

const LINES = [
  { label: "Police", number: "100", icon: Shield, urgent: true },
  { label: "Fire", number: "101", icon: Flame, urgent: true },
  { label: "Ambulance", number: "102", icon: Phone, urgent: true },
  { label: "Municipal Corporation", number: "1916", icon: Building2 },
  { label: "Electricity Complaints", number: "1912", icon: Zap },
  { label: "Water Supply", number: "1916", icon: Droplet },
];

function HotlinesPage() {
  return (
    <div className="px-5 pt-5">
      <h1 className="font-display text-2xl font-bold text-foreground">Hotlines</h1>
      <p className="mt-1 text-sm text-muted-foreground">Direct lines to emergency and civic services.</p>

      <ul className="mt-5 space-y-3">
        {LINES.map(({ label, number, icon: Icon, urgent }) => (
          <li key={label}>
            <a
              href={`tel:${number}`}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                urgent
                  ? "border-destructive/30 bg-destructive/10 hover:border-destructive/50"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                urgent ? "bg-destructive text-destructive-foreground" : "bg-background text-primary"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-bold uppercase tracking-wide text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">Tap to call</div>
              </div>
              <span className="shrink-0 font-display text-lg font-bold text-foreground">{number}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
