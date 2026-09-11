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

function Bezel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border border-white/10 bg-white/5 p-1.5 shadow-[0_30px_80px_rgb(0_0_0/0.55)] backdrop-blur-2xl"
      style={{ borderRadius: "2rem" }}
    >
      <div
        className="border border-white/10 bg-[#0c0c0e]/90 shadow-[inset_0_1px_1px_rgb(255_255_255/0.15)]"
        style={{ borderRadius: "calc(2rem - 0.375rem)" }}
      >
        {children}
      </div>
    </div>
  );
}

function IslandCta({
  to,
  params,
  label,
}: {
  to: "/explore/$sceneId";
  params: { sceneId: string };
  label: string;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="ui-interactive group inline-flex cursor-pointer items-center gap-3 rounded-full bg-emerald-400 py-2 pr-2 pl-6 text-sm font-semibold text-emerald-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-300 active:scale-[0.98]"
    >
      {label}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:scale-105">
        <IconArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </span>
    </Link>
  );
}

function Landing() {
  const flagship = getScene("cardiac");
  const rest = scenes.filter((scene) => scene.id !== "cardiac");
  const totalStructures = scenes.reduce((n, s) => n + s.hotspots.length, 0);
  return (
    <main className="relative bg-[#050505] text-zinc-100">
      <AnimatedBackdrop />
      <SiteNav />
      {/* Hero: editorial split, type left and staggered glass cards right */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-32 pb-24 md:grid-cols-2 md:px-6 md:pt-40 md:pb-40">
          <div>
            <p className="animate-reveal rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-2xl w-max">
              Spatial learning
            </p>

            <h1
              style={{ animationDelay: "120ms" }}
              className="animate-reveal mt-6 max-w-xl text-5xl leading-[1.05] font-bold tracking-tight text-balance md:text-7xl"
            >
              An AI tutor that sees the same 3D space you see.
            </h1>

            <p
              style={{ animationDelay: "240ms" }}
              className="animate-reveal mt-6 max-w-[65ch] text-base leading-relaxed text-zinc-400"
            >
              Explore the Human Heart in 3D. Click a structure and get an explanation from
              your angle.
            </p>

            <div
              style={{ animationDelay: "360ms" }}
              className="animate-reveal mt-10 flex flex-wrap items-center gap-5"
            >
              <IslandCta
                to="/explore/$sceneId"
                params={{ sceneId: "cardiac" }}
                label="Open the Human Heart"
              />
              <Link
                to="/about"
                className="ui-interactive rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
              >
                How it works
              </Link>
            </div>

            <p
              style={{ animationDelay: "480ms" }}
              className="animate-reveal mt-12 font-mono text-xs text-zinc-500"
            >
              <span className="font-semibold text-zinc-200 tabular-nums">
                {scenes.length} modules
              </span>{" "}
              with{" "}
              <span className="font-semibold text-zinc-200 tabular-nums">
                {totalStructures} structures
              </span>{" "}
              and a 5-step heart trace.
            </p>
          </div>
          <div className="animate-reveal" style={{ animationDelay: "300ms" }}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Bezel>
                <div className="p-8">
                  <IconHeart
                    className="h-7 w-7 text-emerald-300"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <p className="mt-6 font-display text-xl font-semibold text-zinc-100">
                    Human Heart
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Flagship module. Four chambers, two circuits, one pump.
                  </p>
                </div>
              </Bezel>
              <div className="sm:mt-12">
                <Bezel>
                  <div className="p-8">
                    <IconPointer
                      className="h-7 w-7 text-emerald-300"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <p className="mt-6 font-display text-xl font-semibold text-zinc-100">
                      Click to learn
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      Every marker answers from your viewpoint.
                    </p>
                  </div>
                </Bezel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules: asymmetrical bento, flagship spans two tracks */}
      <section aria-label="Learning modules" className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-40">
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
          Start with the heart, then see the engine generalize
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {flagship ? (
            <Link
              key={flagship.id}
              to="/explore/$sceneId"
              params={{ sceneId: flagship.id }}
              className="group transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 md:col-span-2"
            >
              <Bezel>
                <div className="p-8 md:p-12">
                  <h3 className="font-display text-3xl font-semibold text-zinc-100 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-emerald-300">
                    {flagship.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">{flagship.tagline}</p>
                  <p className="mt-4 max-w-[65ch] flex-1 text-sm leading-relaxed text-zinc-400">
                    {flagship.description}
                  </p>
                  <p className="mt-8 font-mono text-xs tabular-nums text-zinc-500">
                    {flagship.hotspots.length} structures, {flagship.duration}
                  </p>
                </div>
              </Bezel>
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
                className="group transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
              >
                <Bezel>
                  <div className="flex h-full flex-col p-8">
                    <Icon
                      className="h-7 w-7 text-emerald-300"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <h3 className="mt-6 text-xl font-semibold text-zinc-100 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-emerald-300">
                      {scene.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400">{scene.tagline}</p>
                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
                      {scene.description}
                    </p>
                    <p className="mt-8 font-mono text-xs tabular-nums text-zinc-500">
                      {scene.hotspots.length} structures
                    </p>
                  </div>
                </Bezel>
              </Link>
            );
          })}
        </div>
        {rest.length > 4 ? (
          <p className="mt-8 text-sm text-zinc-500">
            Plus {rest.length - 4} more {rest.length - 4 === 1 ? "module" : "modules"} in
            the same engine. Open any of them from the studio library.
          </p>
        ) : null}
      </section>

      {/* Flagship demo: nested glass chamber with trace pills */}
      <section aria-label="Flagship demo" className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-6 md:pb-40">
        <Bezel>
          <div className="p-8 md:p-16">
            <div className="max-w-[65ch]">
              <h2 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
                {flagship?.title ?? "The Human Heart"}
              </h2>
              <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-zinc-400">
                {flagship?.tagline}. Ask why the left ventricle is thicker than the right,
                then trace oxygenated blood through five structures inside the model.
              </p>
              <div className="mt-8">
                <IslandCta
                  to="/explore/$sceneId"
                  params={{ sceneId: "cardiac" }}
                  label="Enter the heart studio"
                />
              </div>
            </div>
            <ol
              className="mt-10 flex flex-wrap items-center gap-2"
              aria-label="Flagship blood-flow trace"
            >
              {flagshipTrace.map((name, i) => (
                <li key={name} className="flex items-center gap-2">
                  {i > 0 ? (
                    <IconArrowRight
                      className="h-3.5 w-3.5 text-zinc-600"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  ) : null}
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-2xl">
                    <span className="mr-2 font-mono text-[10px] text-emerald-300 tabular-nums">
                      {i + 1}
                    </span>
                    {name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Bezel>
      </section>

      {/* Learning loop: staggered cascade with rotation above md */}
      <section aria-label="How a session flows" className="mx-auto w-full max-w-7xl px-4 pb-24 md:px-6 md:pb-40">
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
          One session, four moves
        </h2>
        <ol className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {loopSteps.map((step, i) => (
            <li
              key={step.label}
              style={i % 2 === 1 ? { transform: "rotate(1.5deg)" } : { transform: "rotate(-1.5deg)" }}
              className="min-w-[260px] snap-start md:min-w-0"
            >
              <Bezel>
                <div className="p-8">
                  <h3 className="font-display text-xl font-semibold text-zinc-100">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.text}</p>
                </div>
              </Bezel>
            </li>
          ))}
        </ol>
      </section>

      {/* Capabilities: glass rows with dividers and single intent links */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-40">
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Explanations anchored to your viewpoint
          </h2>
          <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="grid gap-2 py-8 md:grid-cols-[280px_1fr] md:gap-12"
              >
                <h3 className="text-lg font-semibold text-zinc-100">{c.title}</h3>
                <p className="max-w-[65ch] text-sm leading-relaxed text-zinc-400">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-emerald-300 underline underline-offset-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-emerald-200"
            >
              <IconCpu className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Open the studio
            </Link>
            <Link
              to="/about"
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-300 underline underline-offset-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
            >
              <IconRoute className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Read the technical write-up
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-12 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            <span className="font-semibold text-zinc-200">SPATIA</span>. Built by Ayush
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
