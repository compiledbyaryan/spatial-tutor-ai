import { Link, createFileRoute } from "@tanstack/react-router";
import {
  IconArrowLeft,
  IconArrowRight,
  IconLayersLinked,
  IconRadar,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How SPATIA Works: Architecture and Team" },
      {
        name: "description",
        content:
          "The engineering behind SPATIA: a React Three Fiber rendering pipeline, viewpoint tracking, and a server-side tutor grounded in per-structure datasets.",
      },
      { property: "og:title", content: "How SPATIA Works: Architecture and Team" },
      {
        property: "og:description",
        content:
          "Rendering pipeline, viewpoint tracking and grounded tutoring, explained. By Ayush Kumar and Harsh Pratap.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const layers = [
  {
    id: "L-01",
    icon: IconLayersLinked,
    title: "RENDERING LAYER",
    points: [
      "React Three Fiber over WebGL2, one shadow-casting directional light plus local Lightformer IBL. No CDN HDR fetches.",
      "Models are procedural. Catmull-Rom tubes for great vessels and Gothic ribs, physical materials for tissue.",
      "Pixel ratio capped at 2, 2048px shadow map, geometry reused across markers to stay inside a mobile draw budget.",
    ],
  },
  {
    id: "L-02",
    icon: IconRadar,
    title: "SPATIAL CONTEXT LAYER",
    points: [
      "A tracker samples the camera every 320 ms and derives distance, azimuth and elevation. It emits only on meaningful change.",
      "Raycast picks resolve to a hotspot id with a curated dataset of category, summary and verified key facts.",
      "Telemetry becomes natural language (left side, from above, medium range) before it reaches the model.",
    ],
  },
  {
    id: "L-03",
    icon: IconShieldCheck,
    title: "AI LAYER",
    points: [
      "A TanStack server function owns the model call; the API key never touches the browser bundle.",
      "The prompt carries module pedagogy, the full element inventory, the selected structure dataset and the viewpoint description.",
      "Structured replies validate against a shared contract. When inference is unavailable a deterministic offline answer uses the same shape.",
    ],
  },
];

function About() {
  return (
    <main className="bg-[#0a0a0a] text-[#eaeaea]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#e61919] pb-4">
          <Link
            to="/"
            className="ui-interactive inline-flex cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-4 py-2 font-mono text-xs tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919]"
          >
            <IconArrowLeft className="h-4 w-4" strokeWidth={2} /> BACK TO LIBRARY
          </Link>
          <p className="font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">
            DOC/ABOUT /// REV 2.6
          </p>
        </div>

        <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-black uppercase">
          THREE LAYERS, ONE CONTINUOUS LEARNING LOOP
        </h1>
        <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-[#eaeaea]">
          SPATIA is deliberately lightweight: no native app, no headset, no asset pipeline
          to install. Everything runs in a browser tab, which is what makes it deployable
          to a classroom of mixed devices while still delivering a genuinely spatial
          experience.
        </p>

        <div className="mt-10 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] md:grid-cols-3">
          {layers.map((l) => (
            <section key={l.title} className="bg-[#111111] p-6">
              <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">
                {l.id}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <l.icon className="h-5 w-5 text-[#e61919]" strokeWidth={2} />
                <h2 className="font-display text-lg font-black uppercase">{l.title}</h2>
              </div>
              <dl className="mt-4 space-y-0 border-t border-[#2a2a2a]">
                {l.points.map((p, i) => (
                  <div key={p} className="grid grid-cols-[48px_1fr] gap-3 border-b border-[#2a2a2a] py-3">
                    <dt className="font-mono text-[10px] text-[#9a9a9a] tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </dt>
                    <dd className="text-sm leading-relaxed text-[#eaeaea]">{p}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <section className="mt-px border border-[#2a2a2a] bg-[#111111] p-6">
          <div className="flex items-center gap-2">
            <IconUsers className="h-5 w-5 text-[#e61919]" strokeWidth={2} />
            <h2 className="font-display text-lg font-black uppercase">PROJECT TEAM</h2>
          </div>
          <div className="mt-4 grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] sm:grid-cols-2">
            {[
              { id: "TM-01", name: "AYUSH KUMAR", role: "DESIGN AND 3D INTERACTION ENGINEERING" },
              { id: "TM-02", name: "HARSH PRATAP", role: "AI CONTEXT PIPELINE AND APPLICATION ARCHITECTURE" },
            ].map((m) => (
              <div key={m.name} className="bg-[#0a0a0a] p-4">
                <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">
                  {m.id}
                </p>
                <p className="mt-2 font-display text-base font-black uppercase">{m.name}</p>
                <p className="mt-1 font-mono text-xs text-[#9a9a9a] uppercase">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link
            to="/explore/$sceneId"
            params={{ sceneId: "cathedral" }}
            className="ui-interactive inline-flex cursor-pointer items-center gap-2 bg-[#e61919] px-5 py-3 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a]"
          >
            OPEN THE ARCHITECTURE MODULE
            <IconArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </main>
  );
}
