import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, MapPin } from "lucide-react";
import { useReports, useProfile, timeAgo, categoryMeta, statusLabel, type Status } from "@/lib/civic-store";

export const Route = createFileRoute("/my-reports")({
  head: () => ({ meta: [{ title: "My Reports · CivicLink" }] }),
  component: MyReportsPage,
});

const STEPS: Status[] = ["pending", "in_progress", "resolved"];

function Tracker({ status }: { status: Status }) {
  const idx = STEPS.indexOf(status);
  return (
    <div className="mt-3 flex items-center gap-1.5">
      {STEPS.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-1.5">
          <div className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-primary" : "bg-muted"}`} />
          {i === STEPS.length - 1 && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{statusLabel(status)}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function MyReportsPage() {
  const profile = useProfile();
  const all = useReports();
  const mine = all.filter((r) => r.authorId === profile.id);

  return (
    <div className="px-5 pt-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track status of issues you've submitted.</p>
        </div>
        <Link
          to="/report"
          className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"
          aria-label="New report"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      {mine.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-background text-2xl">📋</div>
          <h2 className="mt-4 font-display text-base font-bold text-foreground">No reports yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Spotted something? Your first report earns +10 XP.</p>
          <Link
            to="/report"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Start a report
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {mine.map((r) => {
            const meta = categoryMeta[r.category];
            return (
              <li key={r.id} className="rounded-2xl border border-border/60 bg-card p-4">
                <div className="flex gap-3">
                  {r.photo ? (
                    <img src={r.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-background text-2xl">{meta.emoji}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-display text-sm font-bold text-foreground">{r.title}</h3>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(r.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> <span className="truncate">{r.address}</span>
                    </div>
                  </div>
                </div>
                <Tracker status={r.status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
