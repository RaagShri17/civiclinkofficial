// Frontend-only store backed by localStorage. Seeded with dummy data on first load.
import { useSyncExternalStore } from "react";

export type Category = "Pothole" | "Streetlight" | "Garbage" | "Hazard" | "Other";
export type Status = "pending" | "in_progress" | "resolved";

export interface Report {
  id: string;
  title: string;
  category: Category;
  description: string;
  severity: number; // 1-5
  lat: number;
  lng: number;
  address: string;
  photo?: string; // data URL
  status: Status;
  createdAt: number;
  upvotes: number;
  authorId: string;
  authorName: string;
}

export interface Profile {
  id: string;
  name: string;
  xp: number;
}

const REPORTS_KEY = "civiclink.reports.v1";
const PROFILE_KEY = "civiclink.profile.v1";

const CATEGORY_META: Record<Category, { emoji: string; tint: string }> = {
  Pothole: { emoji: "🕳️", tint: "oklch(0.78 0.17 70)" },
  Streetlight: { emoji: "💡", tint: "oklch(0.85 0.14 105)" },
  Garbage: { emoji: "🗑️", tint: "oklch(0.72 0.17 145)" },
  Hazard: { emoji: "⚠️", tint: "oklch(0.62 0.22 25)" },
  Other: { emoji: "📌", tint: "oklch(0.74 0.02 95)" },
};

export const categoryMeta = CATEGORY_META;
export const categories: Category[] = ["Pothole", "Streetlight", "Garbage", "Hazard", "Other"];

const SEED_CENTER = { lat: 28.6139, lng: 77.209 }; // New Delhi as default

function seedReports(): Report[] {
  const now = Date.now();
  const minutes = 60_000;
  const hours = 60 * minutes;
  const seedAuthor = { id: "neighbor", name: "A Neighbor" };
  const base: Omit<Report, "id" | "createdAt" | "upvotes" | "authorId" | "authorName">[] = [
    { title: "Deep pothole near crossing", category: "Pothole", description: "Large pothole causing traffic slowdown.", severity: 4, lat: SEED_CENTER.lat + 0.002, lng: SEED_CENTER.lng + 0.001, address: "Main Rd & 2nd Ave", status: "pending" },
    { title: "Streetlight out for a week", category: "Streetlight", description: "Whole block is dark at night.", severity: 3, lat: SEED_CENTER.lat - 0.003, lng: SEED_CENTER.lng + 0.004, address: "Park Lane", status: "in_progress" },
    { title: "Overflowing garbage bin", category: "Garbage", description: "Hasn't been collected in days.", severity: 2, lat: SEED_CENTER.lat + 0.001, lng: SEED_CENTER.lng - 0.003, address: "Market Square", status: "pending" },
    { title: "Exposed wire on sidewalk", category: "Hazard", description: "Dangerous, needs urgent attention.", severity: 5, lat: SEED_CENTER.lat - 0.001, lng: SEED_CENTER.lng - 0.002, address: "School St", status: "resolved" },
    { title: "Broken footpath tile", category: "Other", description: "Tripping hazard near the bus stop.", severity: 2, lat: SEED_CENTER.lat + 0.004, lng: SEED_CENTER.lng + 0.003, address: "Bus Stop 14", status: "resolved" },
    { title: "Flickering streetlight", category: "Streetlight", description: "On and off all night.", severity: 2, lat: SEED_CENTER.lat - 0.002, lng: SEED_CENTER.lng + 0.002, address: "5th Cross Rd", status: "pending" },
    { title: "Pothole near school gate", category: "Pothole", description: "Children walk here daily.", severity: 4, lat: SEED_CENTER.lat + 0.0025, lng: SEED_CENTER.lng - 0.0015, address: "Greenfield School", status: "in_progress" },
    { title: "Illegal dumping spot", category: "Garbage", description: "Construction waste piling up.", severity: 3, lat: SEED_CENTER.lat - 0.0035, lng: SEED_CENTER.lng - 0.001, address: "Behind Plot 22", status: "pending" },
  ];
  return base.map((b, i) => ({
    ...b,
    id: `seed-${i}`,
    createdAt: now - (i + 1) * 3 * hours - Math.floor(Math.random() * 60 * minutes),
    upvotes: Math.floor(Math.random() * 30) + 1,
    authorId: seedAuthor.id,
    authorName: seedAuthor.name,
  }));
}

function loadReports(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (raw) return JSON.parse(raw) as Report[];
  } catch {}
  const seeded = seedReports();
  localStorage.setItem(REPORTS_KEY, JSON.stringify(seeded));
  return seeded;
}

function loadProfile(): Profile {
  if (typeof window === "undefined") return { id: "guest", name: "Active Citizen", xp: 0 };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as Profile;
  } catch {}
  const p: Profile = { id: "guest-" + Math.random().toString(36).slice(2, 8), name: "Active Citizen", xp: 0 };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  return p;
}

const listeners = new Set<() => void>();
let reportsCache: Report[] | null = null;
let profileCache: Profile | null = null;

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getReports(): Report[] {
  if (reportsCache === null) reportsCache = loadReports();
  return reportsCache;
}
function getProfile(): Profile {
  if (profileCache === null) profileCache = loadProfile();
  return profileCache;
}

function persist() {
  if (reportsCache) localStorage.setItem(REPORTS_KEY, JSON.stringify(reportsCache));
  if (profileCache) localStorage.setItem(PROFILE_KEY, JSON.stringify(profileCache));
}

export function useReports() {
  return useSyncExternalStore(subscribe, getReports, () => [] as Report[]);
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getProfile, () => ({ id: "guest", name: "Active Citizen", xp: 0 }) as Profile);
}

export function addReport(input: Omit<Report, "id" | "createdAt" | "upvotes" | "status" | "authorId" | "authorName">) {
  const profile = getProfile();
  const list = getReports();
  const r: Report = {
    ...input,
    id: "r-" + Math.random().toString(36).slice(2, 10),
    createdAt: Date.now(),
    upvotes: 0,
    status: "pending",
    authorId: profile.id,
    authorName: profile.name,
  };
  reportsCache = [r, ...list];
  profileCache = { ...profile, xp: profile.xp + 10 };
  persist();
  emit();
  return r;
}

export function upvote(id: string) {
  const list = getReports();
  reportsCache = list.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  persist();
  emit();
}

export function setStatus(id: string, status: Status) {
  const list = getReports();
  reportsCache = list.map((r) => (r.id === id ? { ...r, status } : r));
  persist();
  emit();
}

export function resetAll() {
  localStorage.removeItem(REPORTS_KEY);
  localStorage.removeItem(PROFILE_KEY);
  reportsCache = null;
  profileCache = null;
  emit();
}

export function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function statusLabel(s: Status) {
  return s === "pending" ? "Pending" : s === "in_progress" ? "In Progress" : "Resolved";
}

export const seedCenter = SEED_CENTER;
