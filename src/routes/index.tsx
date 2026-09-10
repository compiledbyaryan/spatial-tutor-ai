import { Link, createFileRoute } from "@tanstack/react-router";
import { Boxes, Brain, Compass, Cpu, Gauge, MousePointerClick, Radar, Sparkles } from "lucide-react";

import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { scenes } from "@/lib/scenes";

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
    icon: Radar,
    title: "Viewpoint telemetry",
    body: "Camera position, orbit azimuth, elevation and distance stream to the tutor continuously, so explanations are framed from where you actually stand.",
  },
  {
    icon: MousePointerClick,
    title: "Clickable structures",
    body: "Every chamber, atom and stone member is a raycast target with its own curated reference dataset the model is grounded against.",
  },
  {
    icon: Brain,
    title: "Grounded AI tutoring",
    body: "The tutor receives module context, the full element inventory and your selection — then answers in 90–150 words with spatial relationships, never generic text.",
  },
  {
    icon: Gauge,
    title: "Built for weak GPUs",
    body: "Procedural geometry, one shadow-casting light, capped pixel ratio and instanced markers keep the scenes under a mobile-web draw budget.",
  },
];

const pipeline = [
  { step: "01", label: "Navigate", text: "Orbit, pan and zoom a real-time WebGL scene rendered by React Three Fiber." },
  { step: "02", label: "Select", text: "Click a marker; the app resolves the structure and captures your exact viewpoint." },
  { step: "03", label: "Context assembly", text: "A server function fuses module context, element dataset and camera telemetry into a grounded prompt." },
  { step: "04", label: "Explain", text: "The tutor answers about that structure, from that angle, and invites the next spatial question." },
];

function Landing() {
  return (
    <main className="relative">
      <AnimatedBackdrop />
      {/* Hero */}
      <section className="grid-backdrop relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="animate-reveal inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span className="label-mono text-primary">Immersive spatial learning</span>
          </div>

          <h1 style={{ animationDelay: "80ms" }} className="animate-reveal mt-6 max-w-4xl text-4xl leading-[1.05] font-bold md:text-6xl">
            An AI tutor that sees the same 3D space you see.
          </h1>

          <p style={{ animationDelay: "180ms" }} className="animate-reveal mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            SPATIA renders anatomy, molecules and architecture as navigable 3D environments in the
            browser. Explore the Human Heart, click any structure, and the tutor explains exactly what you are
            looking at — from the angle you are standing at — then tests you inside the same space.
          </p>

          <div style={{ animationDelay: "280ms" }} className="animate-reveal mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="inline-flex items-center gap-2 card-lift rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[var(--shadow-glow)]"
            >
              <Boxes className="h-4 w-4" /> Open the Human Heart
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 card-lift rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
            >
              <Cpu className="h-4 w-4" /> How it's engineered
            </Link>
          </div>

          <dl style={{ animationDelay: "380ms" }} className="animate-reveal mt-14 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-3">
            {[
              [String(scenes.length), "Spatial modules"],
              [String(scenes.reduce((n, s) => n + s.hotspots.length, 0)), "Clickable structures"],
              ["5", "Steps in the flagship blood-flow trace"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-primary md:text-3xl">{v}</dt>
                <dd className="label-mono mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Problem → hack */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="panel card-lift p-6 hover:-translate-y-1 hover:border-primary/40">
            <p className="label-mono text-accent">The problem</p>
            <h2 className="mt-3 text-xl font-semibold">2D media breaks spatial understanding</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Textbooks and lecture video force students to reconstruct volume, depth and adjacency in their heads. The
              result is a persistent disconnect: learners can name the left ventricle but cannot say what sits behind
              it, how thick its wall is relative to the right, or why that difference exists at all.
            </p>
          </article>
          <article className="panel card-lift p-6 hover:-translate-y-1 hover:border-primary/40">
            <p className="label-mono text-primary">The approach</p>
            <h2 className="mt-3 text-xl font-semibold">Render the space, then explain it in place</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A lightweight WebGL environment does the spatial work; a viewpoint-aware LLM does the pedagogical work.
              Because the tutor knows your camera angle, distance and current selection, it can teach relationships
              rather than definitions — the thing flat media cannot do.
            </p>
          </article>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-mono text-primary">Learning modules</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Start with the heart, then see the engine generalize</h2>
          </div>
          <Compass className="hidden h-6 w-6 text-muted-foreground md:block" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {scenes.map((scene) => (
            <Link
              key={scene.id}
              to="/explore/$sceneId"
              params={{ sceneId: scene.id }}
              className="panel card-lift group flex flex-col p-5 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase text-primary">
                  {scene.accentLabel}
                </span>
                <span className="label-mono">{scene.level}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">{scene.title}</h3>
              <p className="mt-1 text-xs text-accent">{scene.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{scene.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                <span className="label-mono">{scene.hotspots.length} structures</span>
                <span className="label-mono">{scene.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="label-mono text-primary">Capabilities</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Graphics pipeline meets LLM context awareness</h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.title} className="card-lift rounded-xl border border-border/70 bg-background/40 p-5 hover:-translate-y-1 hover:border-primary/50">
                <c.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-3 text-base font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="label-mono text-accent">Interaction loop</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">From camera coordinates to a grounded explanation</h2>
        <ol className="mt-9 grid gap-4 md:grid-cols-4">
          {pipeline.map((p) => (
            <li key={p.step} className="panel card-lift p-5 hover:-translate-y-1 hover:border-primary/50">
              <span className="font-mono text-xs text-primary">{p.step}</span>
              <h3 className="mt-2 font-display text-base font-semibold">{p.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-display font-semibold text-foreground">SPATIA</span> — designed and built by{" "}
            <span className="text-primary">Ayush Kumar</span> and <span className="text-primary">Harsh Pratap</span>.
          </p>
          <Link to="/about" className="hover:text-primary">
            Technical write-up →
          </Link>
        </div>
      </footer>
    </main>
  );
}
