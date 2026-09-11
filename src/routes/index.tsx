import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Cpu,
  FlaskConical,
  HeartPulse,
  Landmark,
  MousePointerClick,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";

import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { SiteNav } from "@/components/SiteNav";
import { getScene, scenes } from "@/lib/scenes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPATIA — Immersive Spatial Learning Environments" },
      {
        name: "description",
        content:
          "Learn inherently 3D subjects in 3D. SPATIA renders anatomy, molecules and architecture in the browser with a viewpoint-aware AI tutor that explains whatever you click.",
      },
      { property: "og:title", content: "SPATIA — Immersive Spatial Learning Environments" },
      {
        property: "og:description",
        content:
          "Real-time 3D learning modules with a context-aware AI tutor that tracks your viewpoint. Built by Ayush Kumar and Harsh Pratap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const capabilities = [
  {
    icon: MousePointerClick,
    title: "Select a structure",
    body: "Click any labelled marker in the 3D scene. The app resolves the structure and captures your exact viewpoint.",
  },
  {
    icon: Sparkles,
    title: "Get a grounded explanation",
    body: "The tutor answers from your angle and distance, relating the structure to its neighbours — never a generic definition.",
  },
  {
    icon: RouteIcon,
    title: "Prove it in 3D",
    body: "Trace pathways and compare structures by selecting them in the scene. Hints narrow the field instead of revealing answers.",
  },
];

const loopSteps = [
  { label: "Explore", text: "Orbit the model and open any structure." },
  { label: "Ask", text: "Question the tutor from your viewpoint." },
  { label: "Challenge", text: "Answer by selecting structures in 3D." },
  { label: "Master", text: "Review the diagnosed weak area next." },
];

const flagshipTrace = ["Left Atrium", "Mitral Valve", "Left Ventricle", "Aortic Valve", "Aorta"];

const moduleStyles: Record<string, { icon: typeof Boxes; row: string }> = {
  cardiac: { icon: HeartPulse, row: "md:col-span-2" },
  caffeine: { icon: FlaskConical, row: "" },
  cathedral: { icon: Landmark, row: "" },
};

function Landing() {
  const flagship = getScene("cardiac");
  const rest = scenes.filter((scene) => scene.id !== "cardiac");
  return (
    <main className="relative">
      <AnimatedBackdrop />
      <SiteNav />
      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-20 md:pt-16 md:pb-28">
          <div
            className="animate-reveal inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            <span className="label-mono text-primary">Immersive spatial learning</span>
          </div>

          <h1
            style={{ animationDelay: "80ms" }}
            className="animate-reveal mt-6 max-w-4xl text-4xl leading-[1.05] font-bold text-balance md:text-6xl"
          >
            An AI tutor that sees the same 3D space you see.
          </h1>

          <p
            style={{ animationDelay: "180ms" }}
            className="animate-reveal mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            SPATIA renders anatomy, molecules and architecture as navigable 3D environments in
            the browser. Explore the Human Heart, click any structure, and the tutor explains
            exactly what you are looking at — from the angle you are standing at — then tests
            you inside the same space.
          </p>

          <div
            style={{ animationDelay: "280ms" }}
            className="animate-reveal mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              <Boxes className="h-4 w-4" aria-hidden /> Open the Human Heart
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/about"
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground hover:border-primary/60 hover:text-primary"
            >
              <Cpu className="h-4 w-4" aria-hidden /> How it&apos;s engineered
            </Link>
          </div>

          <dl
            style={{ animationDelay: "380ms" }}
            className="animate-reveal mt-14 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-3"
          >
            {[
              [String(scenes.length), "Spatial modules"],
              [String(scenes.reduce((n, s) => n + s.hotspots.length, 0)), "Clickable structures"],
              ["5", "Steps in the flagship blood-flow trace"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-primary tabular-nums md:text-3xl">
                  {v}
                </dt>
                <dd className="label-mono mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Flagship demo strip */}
      <section aria-label="Flagship demo" className="mx-auto max-w-6xl px-6 pt-16 md:pt-20">
        <div className="panel card-lift p-6 hover:border-primary/40 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="label-mono text-primary">Start here · 90 seconds</p>
              <h2 className="mt-3 text-2xl font-semibold text-balance md:text-3xl">
                {flagship?.title ?? "The Human Heart"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {flagship?.tagline}. Ask why the left ventricle is thicker than the right,
                then trace oxygenated blood through five structures — all inside the model.
              </p>
            </div>
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              <HeartPulse className="h-4 w-4" aria-hidden /> Enter the heart studio
            </Link>
          </div>
          <ol className="mt-6 flex flex-wrap items-center gap-1.5" aria-label="Flagship blood-flow trace">
            {flagshipTrace.map((name, i) => (
              <li key={name} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                ) : null}
                <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/90">
                  <span className="mr-1.5 font-mono text-[10px] text-primary tabular-nums">
                    {i + 1}
                  </span>
                  {name}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Learning loop */}
      <section aria-label="How a session flows" className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        <h2 className="text-2xl font-semibold text-balance md:text-3xl">
          One session, four moves
        </h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loopSteps.map((step, i) => (
            <li key={step.label} className="panel card-lift p-5">
              <span className="font-mono text-xs text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-base font-semibold">{step.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Modules */}
      <section aria-label="Learning modules" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="label-mono text-primary">Learning modules</p>
          <h2 className="mt-3 text-2xl font-semibold text-balance md:text-3xl">
            Start with the heart, then see the engine generalize
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {flagship ? (
            <Link
              key={flagship.id}
              to="/explore/$sceneId"
              params={{ sceneId: flagship.id }}
              className="panel card-lift group flex flex-col p-5 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] md:col-span-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase text-primary">
                  <HeartPulse className="h-3 w-3" aria-hidden />
                  {flagship.accentLabel} · Flagship
                </span>
                <span className="label-mono">{flagship.level}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold group-hover:text-primary">
                {flagship.title}
              </h3>
              <p className="mt-1 text-xs text-accent">{flagship.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {flagship.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <span className="label-mono">{flagship.hotspots.length} structures</span>
                <span className="label-mono">{flagship.duration}</span>
              </div>
            </Link>
          ) : null}
          {rest.slice(0, 4).map((scene) => {
            const style = moduleStyles[scene.id] ?? { icon: Boxes, row: "" };
            const Icon = style.icon;
            return (
              <Link
                key={scene.id}
                to="/explore/$sceneId"
                params={{ sceneId: scene.id }}
                className="panel card-lift group flex cursor-pointer flex-col p-5 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase text-primary">
                    <Icon className="h-3 w-3" aria-hidden />
                    {scene.accentLabel}
                  </span>
                  <span className="label-mono">{scene.level}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
                  {scene.title}
                </h3>
                <p className="mt-1 text-xs text-accent">{scene.tagline}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {scene.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="label-mono">{scene.hotspots.length} structures</span>
                  <span className="label-mono">{scene.duration}</span>
                </div>
              </Link>
            );
          })}
        </div>
        {rest.length > 4 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Plus {rest.length - 4} more{" "}
            {rest.length - 4 === 1 ? "module" : "modules"} in the same engine — open any of
            them from the studio library.
          </p>
        ) : null}
      </section>

      {/* Capabilities */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="max-w-2xl text-2xl font-semibold text-balance md:text-3xl">
            Explanations anchored to your viewpoint
          </h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="card-lift rounded-xl border border-border/70 bg-background/40 p-5 hover:-translate-y-1 hover:border-primary/50"
              >
                <c.icon className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-display font-semibold text-foreground">SPATIA</span> — designed
            and built by <span className="text-primary">Ayush Kumar</span> and{" "}
            <span className="text-primary">Harsh Pratap</span>.
          </p>
          <Link to="/about" className="ui-interactive hover:text-primary">
            Technical write-up →
          </Link>
        </div>
      </footer>
    </main>
  );
}
