import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useReports, categoryMeta, statusLabel, seedCenter, categories, type Category, type Status } from "@/lib/civic-store";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Map · CivicLink" }] }),
  component: MapPage,
  ssr: false,
});

function MapPage() {
  const reports = useReports();
  const [mounted, setMounted] = useState(false);
  const [cat, setCat] = useState<Category | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");

  useEffect(() => { setMounted(true); }, []);

  const filtered = reports.filter(
    (r) => (cat === "all" || r.category === cat) && (status === "all" || r.status === status)
  );

  return (
    <div className="px-5 pt-5">
      <h1 className="font-display text-2xl font-bold text-foreground">Map View</h1>
      <p className="mt-1 text-sm text-muted-foreground">Issues reported around you.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
        {categories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {categoryMeta[c].emoji} {c}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {(["all", "pending", "in_progress", "resolved"] as const).map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s === "all" ? "Any status" : statusLabel(s)}
          </Chip>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="h-[60vh] w-full">
          {mounted && <LeafletMap reports={filtered} />}
        </div>
        <Link
          to="/report"
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <Plus className="h-4 w-4" /> Report here
        </Link>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function LeafletMap({ reports }: { reports: ReturnType<typeof useReports> }) {
  // Lazy imports — leaflet is browser-only.
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet") as typeof import("react-leaflet");
  const L = require("leaflet") as typeof import("leaflet");

  const colorFor = (s: string) =>
    s === "resolved" ? "#7BC47F" : s === "in_progress" ? "#D8D365" : "#E6F082";

  const icon = (status: string, emoji: string) =>
    L.divIcon({
      className: "civic-pin",
      html: `<div style="
        background:${colorFor(status)};
        color:#2b2727;
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:grid;place-items:center;
        box-shadow:0 6px 14px -4px rgba(0,0,0,.5);
        border:2px solid #2b2727;
      "><span style="transform:rotate(45deg);font-size:14px">${emoji}</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 30],
    });

  return (
    <MapContainer center={[seedCenter.lat, seedCenter.lng]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {reports.map((r) => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={icon(r.status, categoryMeta[r.category].emoji)}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{r.category} · {statusLabel(r.status)}</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>{r.address}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
