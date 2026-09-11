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
    id: "CAP-01",
    title: "SELECT A STRUCTURE",
    body: "Click any labelled marker in the 3D scene. The app resolves the structure and captures your exact viewpoint.",
  },
  {
    id: "CAP-02",
    title: "GET A GROUNDED EXPLANATION",
    body: "The tutor answers from your angle and distance, relating the structure to its neighbours. Never a generic definition.",
  },
  {
    id: "CAP-03",
    title: "PROVE IT IN 3D",
    body: "Trace pathways and compare structures by selecting them in the scene. Hints narrow the field instead of revealing answers.",
  },
];

const loopSteps = [
  { id: "S1", label: "EXPLORE", text: "Orbit the model and open any structure." },
  { id: "S2", label: "ASK", text: "Question the tutor from your viewpoint." },
  { id: "S3", label: "CHALLENGE", text: "Answer by selecting structures in 3D." },
  { id: "S4", label: "MASTER", text: "Review the diagnosed weak area next." },
];

const flagshipTrace = ["Left Atrium", "Mitral Valve", "Left Ventricle", "Aortic Valve", "Aorta"];

const moduleStyles: Record<string, { icon: typeof IconBox }> = {
  cardiac: { icon: IconHeart },
  caffeine: { icon: IconFlask },
  cathedral: { icon: IconBuildingBank },
};

function Landing() {
  const flagship = getScene("cardiac");
  const rest = scenes.filter((scene) => scene.id !== "cardiac");
  const totalStructures = scenes.reduce((n, s) => n + s.hotspots.length, 0);
  return (
    <main className="relative bg-[#0a0a0a] text-[#eaeaea]">
      <AnimatedBackdrop />
      <SiteNav />
      {/* HERO: full blueprint grid, macro type, telemetry strip */}
      <section className="border-b-2 border-[#2a2a2a]">
        <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-12 md:px-6 md:pt-16 md:pb-16">
          <div className="grid gap-2 border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase sm:grid-cols-3">
            <span>[ SPATIAL LEARNING UNIT ]</span>
            <span className="hidden sm:block">SYS/ONLINE</span>
            <span className="text-right">REV 2.6</span>
          </div>
          <h1
            className="animate-reveal mt-8 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] font-black tracking-[-0.03em] text-balance uppercase"
          >
            AN AI TUTOR THAT SEES THE SAME 3D SPACE YOU SEE
          </h1>
          <div className="mt-8 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] md:grid-cols-[1fr_1fr]">
            <div className="bg-[#0a0a0a] p-6">
              <p className="max-w-[65ch] text-sm leading-relaxed text-[#eaeaea]">
                Explore the Human Heart in 3D. Click a structure and get an explanation
                from your angle.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/explore/$sceneId"
                  params={{ sceneId: "cardiac" }}
                  className="ui-interactive inline-flex cursor-pointer items-center gap-2 bg-[#e61919] px-5 py-3 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a]"
                >
                  OPEN THE HUMAN HEART
                  <IconArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </Link>
                <Link
                  to="/about"
                  className="ui-interactive inline-flex cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-5 py-3 font-mono text-xs tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919]"
                >
                  HOW IT WORKS
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-px bg-[#2a2a2a]">
              {[
                [String(scenes.length), "MODULES"],
                [String(totalStructures), "STRUCTURES"],
                ["05", "TRACE STEPS"],
              ].map(([v, l]) => (
                <div key={l} className="bg-[#111111] p-6">
                  <dt className="order-2 mt-2 font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">
                    {l}
                  </dt>
                  <dd className="font-display text-4xl font-black text-[#eaeaea] tabular-nums">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-8 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] sm:grid-cols-2">
            <div className="bg-[#111111] p-6">
              <IconHeart className="h-6 w-6 text-[#e61919]" strokeWidth={2} aria-hidden />
              <p className="mt-4 font-display text-lg font-black uppercase">
                HUMAN HEART /// FLAGSHIP
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[#9a9a9a] uppercase">
                FOUR CHAMBERS. TWO CIRCUITS. ONE PUMP.
              </p>
            </div>
            <div className="bg-[#111111] p-6">
              <IconPointer className="h-6 w-6 text-[#e61919]" strokeWidth={2} aria-hidden />
              <p className="mt-4 font-display text-lg font-black uppercase">
                CLICK TO LEARN
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[#9a9a9a] uppercase">
                EVERY MARKER ANSWERS FROM YOUR VIEWPOINT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES: rigid compartment grid, 1px gap lines */}
      <section aria-label="Learning modules" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#e61919] pb-4">
          <h2 className="max-w-3xl font-display text-4xl font-black tracking-[-0.03em] uppercase md:text-6xl">
            START WITH THE HEART
          </h2>
          <p className="font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase">
            UNIT/D-01
          </p>
        </div>

        <div className="mt-8 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] md:grid-cols-6">
          {flagship ? (
            <Link
              key={flagship.id}
              to="/explore/$sceneId"
              params={{ sceneId: flagship.id }}
              className="group bg-[#111111] p-6 transition-colors duration-100 hover:bg-[#161616] md:col-span-4 md:p-8"
            >
              <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">
                [ FLAGSHIP /// {flagship.hotspots.length} STRUCTURES ]
              </p>
              <h3 className="mt-3 font-display text-2xl font-black uppercase group-hover:underline group-hover:decoration-[#e61919] group-hover:decoration-4 group-hover:underline-offset-4 md:text-3xl">
                {flagship.title}
              </h3>
              <p className="mt-2 font-mono text-xs text-[#9a9a9a] uppercase">
                {flagship.tagline}
              </p>
              <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-[#eaeaea]">
                {flagship.description}
              </p>
              <p className="mt-5 font-mono text-xs tabular-nums text-[#9a9a9a] uppercase">
                DURATION: {flagship.duration}
              </p>
            </Link>
          ) : null}
          {rest.slice(0, 4).map((scene) => {
            const style = moduleStyles[scene.id] ?? { icon: IconBox };
            const Icon = style.icon;
            return (
              <Link
                key={scene.id}
                to="/explore/$sceneId"
                params={{ sceneId: scene.id }}
                className="group bg-[#111111] p-6 transition-colors duration-100 hover:bg-[#161616] md:col-span-2"
              >
                <Icon className="h-6 w-6 text-[#e61919]" strokeWidth={2} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-black uppercase group-hover:underline group-hover:decoration-[#e61919] group-hover:decoration-4 group-hover:underline-offset-4">
                  {scene.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-[#9a9a9a] uppercase">
                  {scene.tagline}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#eaeaea]">
                  {scene.description}
                </p>
                <p className="mt-5 font-mono text-xs tabular-nums text-[#9a9a9a] uppercase">
                  {scene.hotspots.length} STRUCTURES
                </p>
              </Link>
            );
          })}
        </div>
        {rest.length > 4 ? (
          <p className="mt-5 font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase">
            PLUS {rest.length - 4} MORE {(rest.length - 4 === 1 ? "MODULE" : "MODULES")} IN
            THE SAME ENGINE. OPEN ANY OF THEM FROM THE STUDIO LIBRARY.
          </p>
        ) : null}
      </section>

      {/* FLAGSHIP DEMO: full-width compartment with raw data table */}
      <section aria-label="Flagship demo" className="border-y-2 border-[#2a2a2a] bg-[#111111]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">
            /// FLAGSHIP DEMO
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase md:text-6xl">
            {flagship?.title ?? "THE HUMAN HEART"}
          </h2>
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-[#eaeaea]">
            {flagship?.tagline}. Ask why the left ventricle is thicker than the right,
            then trace oxygenated blood through five structures inside the model.
          </p>
          <Link
            to="/explore/$sceneId"
            params={{ sceneId: "cardiac" }}
            className="ui-interactive mt-6 inline-flex cursor-pointer items-center gap-2 bg-[#e61919] px-5 py-3 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a]"
          >
            ENTER THE HEART STUDIO
            <IconArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
          <table className="mt-8 w-full border-collapse border border-[#2a2a2a] font-mono text-xs uppercase">
            <caption className="py-2 text-left tracking-[0.1em] text-[#9a9a9a]">
              FLAGSHIP BLOOD-FLOW TRACE /// 5 ROWS
            </caption>
            <thead>
              <tr className="bg-[#161616] text-left">
                <th scope="col" className="border border-[#2a2a2a] px-3 py-2 text-[#9a9a9a]">
                  SEQ
                </th>
                <th scope="col" className="border border-[#2a2a2a] px-3 py-2 text-[#9a9a9a]">
                  STRUCTURE
                </th>
              </tr>
            </thead>
            <tbody>
              {flagshipTrace.map((name, i) => (
                <tr key={name} className="bg-[#0a0a0a]">
                  <td className="border border-[#2a2a2a] px-3 py-2 text-[#e61919] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="border border-[#2a2a2a] px-3 py-2 text-[#eaeaea]">
                    {name.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LEARNING LOOP: dense telemetry strip, four cells */}
      <section aria-label="How a session flows" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="font-display text-4xl font-black uppercase md:text-6xl">
          ONE SESSION, FOUR MOVES
        </h2>
        <ol className="mt-8 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] sm:grid-cols-2 lg:grid-cols-4">
          {loopSteps.map((step) => (
            <li key={step.label} className="bg-[#111111] p-6">
              <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">
                {step.id}
              </p>
              <h3 className="mt-2 font-display text-xl font-black uppercase">{step.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#eaeaea]">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CAPABILITIES: definition list rows with top rules only */}
      <section className="border-t-2 border-[#2a2a2a]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <h2 className="max-w-3xl font-display text-4xl font-black uppercase md:text-6xl">
            EXPLANATIONS ANCHORED TO YOUR VIEWPOINT
          </h2>
          <dl className="mt-10 border-t-2 border-[#eaeaea]">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="grid gap-2 border-b border-[#2a2a2a] py-6 md:grid-cols-[200px_1fr] md:gap-8"
              >
                <dt className="font-mono text-xs tracking-[0.1em] text-[#e61919] uppercase">
                  {c.id}
                </dt>
                <dd>
                  <h3 className="font-display text-lg font-black uppercase">{c.title}</h3>
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-[#eaeaea]">
                    {c.body}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/explore/$sceneId"
              params={{ sceneId: "cardiac" }}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-5 py-3 font-mono text-xs tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919]"
            >
              <IconCpu className="h-4 w-4" strokeWidth={2} aria-hidden />
              OPEN THE STUDIO
            </Link>
            <Link
              to="/about"
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-5 py-3 font-mono text-xs tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919]"
            >
              <IconRoute className="h-4 w-4" strokeWidth={2} aria-hidden />
              TECHNICAL WRITE-UP
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[#e61919]">
        <div className="mx-auto grid w-full max-w-7xl gap-2 px-4 py-8 font-mono text-xs tracking-[0.1em] uppercase md:grid-cols-2 md:px-6">
          <p className="text-[#eaeaea]">
            <span className="font-bold">SPATIA©</span> BUILT BY AYUSH KUMAR AND HARSH PRATAP
          </p>
          <p className="text-[#9a9a9a] md:text-right">
            HUMAN HEART / MOLECULES / ARCHITECTURE /// ONE ENGINE
          </p>
        </div>
      </footer>
    </main>
  );
}
