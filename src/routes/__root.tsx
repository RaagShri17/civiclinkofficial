import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, Rss, Plus, Map as MapIcon, ClipboardList, Bell } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "CivicLink — Report neighborhood issues" },
      { name: "description", content: "Spotted a pothole, broken streetlight, or hazard? Report civic issues in 3 simple steps and track resolution." },
      { name: "theme-color", content: "#454040" },
      { property: "og:title", content: "CivicLink — Report neighborhood issues" },
      { property: "og:description", content: "Spotted a pothole, broken streetlight, or hazard? Report civic issues in 3 simple steps and track resolution." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "CivicLink — Report neighborhood issues" },
      { name: "twitter:description", content: "Spotted a pothole, broken streetlight, or hazard? Report civic issues in 3 simple steps and track resolution." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9753691e-a9eb-41b4-b317-927b21e4a11c/id-preview-c1681af4--b10bc056-22d2-4d3d-b290-4529c317aaa6.lovable.app-1782153886215.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9753691e-a9eb-41b4-b317-927b21e4a11c/id-preview-c1681af4--b10bc056-22d2-4d3d-b290-4529c317aaa6.lovable.app-1782153886215.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=", crossOrigin: "" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV: Array<{ to: string; label: string; icon: typeof Home; primary?: boolean }> = [
  { to: "/", label: "Home", icon: Home },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/report", label: "Report", icon: Plus, primary: true },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/my-reports", label: "Mine", icon: ClipboardList },
];

function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/85 px-5 py-4 backdrop-blur">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          CIVIC<span className="text-primary">LINK</span>
        </Link>
        <button
          onClick={() => toast("🔔 New issue reported nearby", { description: "Pothole on Main Rd · 2 min ago" })}
          className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card text-foreground transition hover:border-primary/40 hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </header>
      <main className="flex-1">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border/60 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <ul className="grid grid-cols-5 items-end">
          {NAV.map(({ to, label, icon: Icon, primary }) => {
            const active = pathname === to;
            if (primary) {
              return (
                <li key={to} className="flex justify-center">
                  <Link
                    to={to}
                    className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_oklch(0.85_0.14_105/0.6)] ring-4 ring-background transition active:scale-95"
                    aria-label="Report"
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                </li>
              );
            }
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
