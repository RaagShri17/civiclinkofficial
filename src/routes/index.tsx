import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, ArrowRight, Map as MapIcon, Rss, ClipboardList, Phone } from "lucide-react";
import { useReports, useProfile, timeAgo, categoryMeta, statusLabel } from "@/lib/civic-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicLink — Home" },
      { name: "description", content: "Your neighborhood dashboard: report issues, track progress, see what's happening nearby." },
    ],
  }),
  component: Home,
});

function StatTile({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center px-2 py-1">
      <div className={`font-display text-3xl font-bold leading-none ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, subtitle }: { to: string; icon: any; title: string; subtitle: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4 transition hover:border-primary/40 hover:bg-card/80"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-background text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-sm font-bold uppercase tracking-wide text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </Link>
  );
}

function Home() {
  const reports = useReports();
  const profile = useProfile();
  const mine = reports.filter((r) => r.authorId === profile.id);
  const myResolved = mine.filter((r) => r.status === "resolved").length;
  const recent = reports.slice(0, 3);

  return (
    <div className="space-y-5 px-5 pt-5">
      {/* Welcome + stats */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold text-foreground">Welcome Back!</h1>
            <span className="mt-0.5 inline-block rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Active Citizen
            </span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 divide-x divide-border/60">
          <StatTile value={mine.length} label="Reported" />
          <StatTile value={myResolved} label="Resolved" />
          <StatTile value={profile.xp} label="Community Score" accent />
        </div>
      </section>

      {/* Report CTA */}
      <Link
        to="/report"
        className="block rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card to-card p-5 transition hover:border-primary/70"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1 font-display text-base font-bold uppercase tracking-wide text-foreground">
              Report Issue <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Spotted something in the neighborhood? Report a pothole, streetlight or hazard in 3 simple steps.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Start Report <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-border/60 bg-background">
            <Camera className="h-7 w-7 text-primary" />
          </div>
        </div>
      </Link>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <QuickAction to="/map" icon={MapIcon} title="Map View" subtitle="Browse reports near you" />
        <QuickAction to="/feed" icon={Rss} title="Feed" subtitle="Community reports" />
        <QuickAction to="/my-reports" icon={ClipboardList} title="My Reports" subtitle="Check status updates" />
        <QuickAction to="/hotlines" icon={Phone} title="Hotlines" subtitle="Direct emergency calls" />
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Feed Activity</h2>
        <ul className="space-y-2">
          {recent.map((r) => {
            const meta = categoryMeta[r.category];
            return (
              <li key={r.id}>
                <Link
                  to="/feed"
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 transition hover:border-primary/40"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-background text-xl">
                    {meta.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">{r.title}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {r.address} · {timeAgo(r.createdAt)}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    r.status === "resolved" ? "bg-[oklch(0.72_0.17_145/0.18)] text-[oklch(0.82_0.17_145)]" :
                    r.status === "in_progress" ? "bg-primary/15 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>{statusLabel(r.status)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
