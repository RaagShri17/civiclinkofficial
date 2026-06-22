import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, MapPin, Sparkles, Check } from "lucide-react";
import { addReport, categories, categoryMeta, seedCenter, type Category } from "@/lib/civic-store";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Report an Issue · CivicLink" }] }),
  component: ReportPage,
});

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/60" : "w-4 bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReportPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const [category, setCategory] = useState<Category | null>(null);
  const [severity, setSeverity] = useState(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ ...seedCenter });
  const [photo, setPhoto] = useState<string | undefined>();

  function detect() {
    if (!navigator.geolocation) {
      toast.error("Geolocation not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Location detected");
      },
      () => toast.error("Couldn't get your location"),
      { timeout: 5000 }
    );
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  }

  function submit() {
    if (!category) return;
    addReport({
      title: title || `${category} reported`,
      category,
      description,
      severity,
      lat: coords.lat,
      lng: coords.lng,
      address: address || "Unknown location",
      photo,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          <Check className="h-12 w-12" strokeWidth={3} />
          <Sparkles className="absolute -right-2 -top-2 h-7 w-7 animate-pulse text-primary-glow" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Report submitted!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Thanks for keeping the neighborhood better.</p>
        <div className="mt-5 flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-display text-base font-bold text-primary">
          <Sparkles className="h-4 w-4" /> +10 XP earned
        </div>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={() => nav({ to: "/my-reports" })}
            className="rounded-2xl bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground"
          >
            View My Reports
          </button>
          <button
            onClick={() => nav({ to: "/" })}
            className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5">
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : nav({ to: "/" }))}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <StepDots step={step} />
        <span className="w-10 text-right text-xs text-muted-foreground">{step}/3</span>
      </div>

      {step === 1 && (
        <section className="space-y-5">
          <header>
            <h1 className="font-display text-2xl font-bold text-foreground">What did you spot?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Pick a category.</p>
          </header>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => {
              const meta = categoryMeta[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
                    active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="text-3xl">{meta.emoji}</span>
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-foreground">{c}</span>
                </button>
              );
            })}
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Severity · {severity}/5
            </label>
            <input
              type="range" min={1} max={5} value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Minor</span><span>Urgent</span>
            </div>
          </div>
          <button
            disabled={!category}
            onClick={() => setStep(2)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <header>
            <h1 className="font-display text-2xl font-bold text-foreground">Where is it?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Auto-detect or enter manually.</p>
          </header>
          <button
            onClick={detect}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-3 text-sm font-semibold text-primary"
          >
            <MapPin className="h-4 w-4" /> Use my current location
          </button>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</label>
            <input
              value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Main Rd & 2nd Ave"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Latitude</label>
              <input
                type="number" step="0.0001" value={coords.lat}
                onChange={(e) => setCoords({ ...coords, lat: Number(e.target.value) })}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Longitude</label>
              <input
                type="number" step="0.0001" value={coords.lng}
                onChange={(e) => setCoords({ ...coords, lng: Number(e.target.value) })}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(3)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-5">
          <header>
            <h1 className="font-display text-2xl font-bold text-foreground">Tell us more</h1>
            <p className="mt-1 text-sm text-muted-foreground">Add a short title, description and a photo.</p>
          </header>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole near crossing"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What's the issue? Any details that help?"
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card py-6 text-muted-foreground transition hover:border-primary/50 hover:text-primary">
            {photo ? (
              <img src={photo} alt="" className="h-32 w-full rounded-xl object-cover" />
            ) : (
              <>
                <Camera className="h-7 w-7" />
                <span className="text-xs font-semibold uppercase tracking-wide">Tap to add a photo</span>
              </>
            )}
            <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
          </label>
          <button
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground"
          >
            Submit Report <Check className="h-4 w-4" />
          </button>
        </section>
      )}
    </div>
  );
}
