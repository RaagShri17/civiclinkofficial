import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, MapPin } from "lucide-react";
import { useReports, upvote, timeAgo, categoryMeta, statusLabel, seedCenter, type Report } from "@/lib/civic-store";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Community Feed · CivicLink" }] }),
  component: FeedPage,
});

type Filter = "all" | "nearby" | "resolved";

function distance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dx = a.lat - b.lat, dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

function Card({ r }: { r: Report }) {
  const meta = categoryMeta[r.category];
  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      {r.photo && <img src={r.photo} alt="" className="h-40 w-full object-cover" />}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-background text-base">{meta.emoji}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{r.category}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">{timeAgo(r.createdAt)}</span>
        </div>
        <h3 className="mt-2 font-display text-base font-bold text-foreground">{r.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {r.address}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
            r.status === "resolved" ? "bg-[oklch(0.72_0.17_145/0.18)] text-[oklch(0.82_0.17_145)]" :
            r.status === "in_progress" ? "bg-primary/15 text-primary" :
            "bg-muted text-muted-foreground"
          }`}>{statusLabel(r.status)}</span>
          <button
            onClick={() => upvote(r.id)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowUp className="h-3.5 w-3.5" /> {r.upvotes}
          </button>
        </div>
      </div>
    </article>
  );
}

function FeedPage() {
  const reports = useReports();
  const [filter, setFilter] = useState<Filter>("all");

  let list = reports;
  if (filter === "resolved") list = list.filter((r) => r.status === "resolved");
  if (filter === "nearby") {
    list = [...list].sort((a, b) => distance(a, seedCenter) - distance(b, seedCenter)).slice(0, 6);
  }

  return (
    <div className="px-5 pt-5">
      <h1 className="font-display text-2xl font-bold text-foreground">Community Feed</h1>
      <p className="mt-1 text-sm text-muted-foreground">What neighbors are reporting right now.</p>

      <div className="mt-4 flex gap-2">
        {(["all", "nearby", "resolved"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.map((r) => <Card key={r.id} r={r} />)}
        {list.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No reports here yet.
          </div>
        )}
      </div>
    </div>
  );
}
