import { Link } from "@tanstack/react-router";
import { ArrowLeft, Layers, Orbit, RotateCcw, Sliders } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { SceneCanvas, type Viewpoint } from "./scene/SceneCanvas";
import { TutorPanel } from "./TutorPanel";
import type { SceneModule } from "@/lib/scenes";
import type { SceneAction } from "@/lib/tutor-contracts";

const SCENE_TOGGLES: Record<string, { key: string; label: string }[]> = {
  cardiac: [{ key: "pulse", label: "Cardiac cycle animation" }],
  caffeine: [{ key: "hydrogens", label: "Show hydrogen atoms" }],
  cathedral: [{ key: "vault", label: "Show rib vault" }],
  dna: [{ key: "unwind", label: "Tighten the helix" }],
  "wave-interference": [{ key: "twoSources", label: "Second wave source" }],
  lattice: [{ key: "bonds", label: "Show ionic bonds" }],
};

export function StudioView({ scene }: { scene: SceneModule }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewpoint, setViewpoint] = useState<Viewpoint | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [options, setOptions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((SCENE_TOGGLES[scene.id] ?? []).map((t) => [t.key, true])),
  );
  const [key, setKey] = useState(0);

  const hotspot = useMemo(() => scene.hotspots.find((h) => h.id === activeId) ?? null, [scene, activeId]);
  const onViewpoint = useCallback((v: Viewpoint) => setViewpoint(v), []);
  const onSelect = useCallback((id: string) => setActiveId(id === "" ? null : id), []);
  const onSceneActions = useCallback((actions: SceneAction[]) => {
    for (const action of actions) {
      if (action.type === "focus") setActiveId(action.hotspotId);
      if ((action.type === "highlight" || action.type === "isolate" || action.type === "fadeOthers") && action.hotspotIds[0]) {
        setActiveId(action.hotspotIds[0]);
      }
      if (action.type === "resetScene") {
        setKey((value) => value + 1);
        setActiveId(null);
      }
      if (action.type === "setAnimation") {
        setOptions((value) => ({ ...value, [action.animation]: action.enabled }));
      }
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold md:text-lg">{scene.title}</h1>
            <p className="label-mono truncate">
              {scene.subject} · {scene.level}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
              autoRotate ? "border-primary/70 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Orbit className="h-3.5 w-3.5" /> Orbit
          </button>
          <button
            onClick={() => {
              setKey((k) => k + 1);
              setActiveId(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset view
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[260px_1fr_360px] md:p-4">
        {/* Structure index */}
        <aside className="panel order-2 hidden min-h-0 flex-col overflow-hidden lg:order-1 lg:flex">
          <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-semibold">Structure index</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {scene.hotspots.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setActiveId(h.id)}
                className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                  activeId === h.id ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-secondary/60"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium">{h.name}</span>
                </div>
                <span className="mt-0.5 block pl-6 text-[11px] text-muted-foreground">{h.category}</span>
              </button>
            ))}
          </div>
          {(SCENE_TOGGLES[scene.id] ?? []).length > 0 ? (
            <div className="border-t border-border/70 px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-accent" />
                <span className="label-mono">Render options</span>
              </div>
              {(SCENE_TOGGLES[scene.id] ?? []).map((t) => (
                <label key={t.key} className="mb-1.5 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={options[t.key] ?? false}
                    onChange={(e) => setOptions((o) => ({ ...o, [t.key]: e.target.checked }))}
                    className="h-3.5 w-3.5 accent-[var(--primary)]"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          ) : null}
        </aside>

        {/* Viewport */}
        <section className="panel relative order-1 min-h-[45vh] overflow-hidden lg:order-2">
          <SceneCanvas
            key={key}
            scene={scene}
            activeHotspot={activeId}
            onSelectHotspot={onSelect}
            onViewpoint={onViewpoint}
            options={options}
            autoRotate={autoRotate}
          />
          <div className="pointer-events-none absolute left-4 top-4 max-w-xs">
            <p className="label-mono">{scene.accentLabel} module</p>
            <p className="mt-1 text-xs text-muted-foreground">{scene.tagline}</p>
          </div>
          {hotspot ? (
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-xl border border-accent/40 bg-background/80 p-3 backdrop-blur-md md:max-w-md">
              <p className="label-mono text-accent">{hotspot.category}</p>
              <p className="mt-1 font-display text-sm font-semibold">{hotspot.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hotspot.summary}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {hotspot.facts.map((f) => (
                  <li key={f} className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="pointer-events-none absolute bottom-4 left-4 text-xs text-muted-foreground">
              Drag to orbit · scroll to zoom · click a marker to ask the tutor
            </p>
          )}
        </section>

        {/* Tutor */}
        <aside className="order-3 min-h-[42vh] lg:min-h-0">
          <TutorPanel scene={scene} hotspot={hotspot} viewpoint={viewpoint} onSceneActions={onSceneActions} />
        </aside>
      </div>
    </div>
  );
}
