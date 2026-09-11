import { Link, createFileRoute } from "@tanstack/react-router";
import {
  IconArrowRight,
  IconBox,
  IconBuildingBank,
  IconCpu,
  IconFlask,
  IconHeart,
  IconPointer,
  IconRoute,
} from "@tabler/icons-react";

import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { SiteNav } from "@/components/SiteNav";
import { getScene, scenes } from "@/lib/scenes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPATIA: Immersive Spatial Learning Environments" },
      {
        name: "description",
        content:
          "Learn 3D subjects in 3D. SPATIA renders anatomy, molecules and architecture in the browser. A viewpoint-aware tutor explains whatever you click.",
      },
      { property: "og:title", content: "SPATIA: Immersive Spatial Learning Environments" },
      {
        property: "og:description",
        content:
          "Real-time 3D learning modules with a context-aware tutor that tracks your viewpoint. Built by Ayush Kumar and Harsh Pratap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const capabilities = [
  {
    title: "Select a structure",
    body: "Click any labelled marker in the 3D scene. The app resolves the structure and captures your exact viewpoint.",
  },
  {
    title: "Get a grounded explanation",
    body: "The tutor answers from your angle and distance, relating the structure to its neighbours. Never a generic definition.",
  },
  {
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

const moduleStyles: Record<string, { icon: typeof IconBox; row: string }> = {
  cardiac: { icon: IconHeart, row: "md:col-span-2" },
  caffeine: { icon: IconFlask, row: "" },
  cathedral: { icon: IconBuildingBank, row: "" },
};

function Landing() {
  const flagship = getScene("cardiac");
  const rest = scenes.filter((scene) => scene.id !== "cardiac");
  const totalStructures = scenes.reduce((n, s) => n + s.hotspots.length, 0);
  return (
    <main className="relative">
      <AnimatedBackdrop />
      <SiteNav />
      {/* Hero: split message and module preview, CTA visible without scroll */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-16 pb-20 md:grid-cols-2 md:pt-24 md:pb-28">
          <div>
            <p className="animate-reveal text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Spatial learning
            </p>

            <h1
              style={{ animationDelay: "80ms" }}
              className="animate-reveal mt-4 max-w-xl text-4xl leading-none font-bold tracking-tighter text-balance md:text-6xl"
            >
              An AI tutor that sees the same 3D space you see.
            </h1>

            <p
              style={{ animationDelay: "180ms" }}
              className="animate-reveal mt-5 max-w-[65ch] text-base leading-relaxed text-gray-600"
            >
              Explore the Human Heart in 3D. Click a structure and get an explanation from
              your angle.
            </p>

            <div
              style={{ animationDelay: "280ms" }}
              className="animate-reveal mt-8 flex flex-wrap items-center gap-5"
            >
              <Link
                to="/explore/$sceneId"
                params={{ sceneId: "cardiac" }}
                className="ui-interactive inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]"
                style={{ borderRadius: 12 }}
              >
                Open the Human Heart
                <IconArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/about"
                className="ui-interactive text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                How it works
              </Link>
            </div>

            <p
              style={{ animationDelay: "380ms" }}
              className="animate-reveal mt-10 text-sm text-muted-foreground"
            >
              <span className="font-semibold text-foreground tabular-nums">
                {scenes.length} modules
              </span>{" "}
              with{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {totalStructures} structures
              </span>{" "}
              and a 5-step heart trace.
            </p>
          </div>
          <div className="animate-reveal" style={{ animationDelay: "200ms" }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="border border-border/70 bg-surface/60 p-6"
                style={{ borderRadius: 16 }}
              >
                <IconHeart className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />
                <p className="mt-4 font-display text-lg font-semibold">Human Heart</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Flagship module. Four chambers, two circuits, one pump.
                </p>
              </div>
              <div
                className="border border-border/70 bg-surface/60 p-6 sm:mt-8"
                style={{ borderRadius: 16 }}
              >
                <IconPointer className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />
                <p className="mt-4 font-display text-lg font-semibold">Click to learn</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every marker answers from your viewpoint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules: asymmetric bento, flagship spans two columns */}
      <section aria-label="Learning modules" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2 className="max-w-xl text-4xl font-bold tracking-tighter text-balance md:text-5xl">
          Start with the heart, then see the engine generalize
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {flagship ? (
            <Link
              key={flagship.id}
              to="/explore/$sceneId"
              params={{ sceneId: flagship.id }}
              className="group flex flex-col border border-border/70 bg-surface p-6 transition-all duration-300 hover:border-primary/50 md:col-span-2 md:p-8"
              style={{ borderRadius: 16 }}
            >
              <h3 className="font-display text-2xl font-semibold group-hover:text-primary">
                {flagship.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{flagship.tagline}</p>
              <p className="mt-3 max-w-[65ch] flex-1 text-sm leading-relaxed text-gray-600">
                {flagship.description}
              </p>
              <p className="mt-5 font-mono text-xs tabular-nums text-muted-foreground">
                {flagship.hotspots.length} structures, {flagship.duration}
              </p>
            </Link>
          ) : null}
          {rest.slice(0, 4).map((scene) => {
            const style = moduleStyles[scene.id] ?? { icon: IconBox, row: "" };
            const Icon = style.icon;
            return (
              <Link
                key={scene.id}
                to="/explore/$sceneId"
                params={{ sceneId: scene.id }}
                className="group flex cursor-pointer flex-col border border-border/70 bg-surface p-6 transition-all duration-300 hover:border-primary/50"
                style={{ borderRadius: 16 }}
              >
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
                  {scene.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{scene.tagline}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {scene.description}
                </p>
                <p className="mt-5 font-mono text-xs tabular-nums text-muted-foreground">
                  {scene.hotspots.length} structures
                </p>
              </Link>
            );
          })}
        </div>
        {rest.length > 4 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Plus {rest.length - 4} more {rest.length - 4 === 1 ? "module" : "modules"} in
            the same engine. Open any of them from the studio library.
          </p>
        ) : null}
      </section>

      {/* Flagship demo: single vertical stack, trace reads as one sequence */}
      <section aria-label="Flagship demo" className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div
          className="border border-border/70 bg-surface/60 p-6 md:p-10"
          style={{ borderRadius: 16 }}
        >
          <div className="max-w-[65ch]">
            <h2 className="text-4xl font-bold tracking-tighter text-balance md:text-5xl">
              {flagship?.title ?? "The Human Heart"}
            </h2>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-gray-600">
              {flagship?.tagline}. Ask why the left ventricle is thicker than the right,
              then trace oxygenated blood through five structures inside the model.
            </p>
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive mt-6 inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]"
              style={{ borderRadius: 12 }}
            >
              Enter the heart studio
              <IconArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          <ol
            className="mt-6 flex flex-wrap items-center gap-1.5"
            aria-label="Flagship blood-flow trace"
          >
            {flagshipTrace.map((name, i) => (
              <li key={name} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <IconArrowRight
                    className="h-3.5 w-3.5 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
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

      {/* Learning loop: horizontal snap on mobile, four columns on desktop */}
      <section
        aria-label="How a session flows"
        className="border-t border-border/60 bg-surface/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <h2 className="max-w-xl text-4xl font-bold tracking-tighter text-balance md:text-5xl">
            One session, four moves
          </h2>
          <ol className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
            {loopSteps.map((step) => (
              <li
                key={step.label}
                className="min-w-[240px] snap-start border border-border/70 bg-background/60 p-6 md:min-w-0"
                style={{ borderRadius: 16 }}
              >
                <h3 className="font-display text-lg font-semibold">{step.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Capabilities: plain rows with dividers keep the palette locked */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <h2 className="max-w-xl text-4xl font-bold tracking-tighter text-balance md:text-5xl">
            Explanations anchored to your viewpoint
          </h2>
          <div className="mt-10 divide-y divide-border/70 border-y border-border/70">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="grid gap-2 py-6 md:grid-cols-[240px_1fr] md:gap-8"
              >
                <h3 className="text-base font-semibold">{c.title}</h3>
                <p className="max-w-[65ch] text-sm leading-relaxed text-gray-600">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              <IconCpu className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Open the studio
            </Link>
            <Link
              to="/about"
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              <IconRoute className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Read the technical write-up
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold text-foreground">SPATIA</span>. Built by Ayush
            Kumar and Harsh Pratap.
          </p>
          <p className="font-mono text-xs">
            Human Heart, molecules, architecture. One engine.
          </p>
        </div>
      </footer>
    </main>
  );
}
