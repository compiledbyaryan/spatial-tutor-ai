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
    icon: IconLayersLinked,
    title: "Rendering layer",
    points: [
      "React Three Fiber over WebGL2, one shadow-casting directional light plus local Lightformer IBL. No CDN HDR fetches.",
      "Models are procedural. Catmull-Rom tubes for great vessels and Gothic ribs, physical materials for tissue.",
      "Pixel ratio capped at 2, 2048px shadow map, geometry reused across markers to stay inside a mobile draw budget.",
    ],
  },
  {
    icon: IconRadar,
    title: "Spatial context layer",
    points: [
      "A tracker samples the camera every 320 ms and derives distance, azimuth and elevation. It emits only on meaningful change.",
      "Raycast picks resolve to a hotspot id with a curated dataset of category, summary and verified key facts.",
      "Telemetry becomes natural language (left side, from above, medium range) before it reaches the model.",
    ],
  },
  {
    icon: IconShieldCheck,
    title: "AI layer",
    points: [
      "A TanStack server function owns the model call; the API key never touches the browser bundle.",
      "The prompt carries module pedagogy, the full element inventory, the selected structure dataset and the viewpoint description.",
      "Structured replies validate against a shared contract. When inference is unavailable a deterministic offline answer uses the same shape.",
    ],
  },
];

function About() {
  return (
    <main className="bg-[#050505] text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-4 pt-32 pb-24 md:px-6 md:pt-40 md:pb-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 hover:text-white"
        >
          <IconArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back to library
        </Link>

        <h1 className="mt-10 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
          Three layers, one continuous learning loop
        </h1>
        <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-zinc-400">
          SPATIA is deliberately lightweight: no native app, no headset, no asset pipeline
          to install. Everything runs in a browser tab, which is what makes it deployable
          to a classroom of mixed devices while still delivering a genuinely spatial
          experience.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {layers.map((l) => (
            <div
              key={l.title}
              className="border border-white/10 bg-white/5 p-1.5 shadow-[0_30px_80px_rgb(0_0_0/0.55)] backdrop-blur-2xl"
              style={{ borderRadius: "2rem" }}
            >
              <section
                className="h-full border border-white/10 bg-[#0c0c0e]/90 p-6 shadow-[inset_0_1px_1px_rgb(255_255_255/0.15)]"
                style={{ borderRadius: "calc(2rem - 0.375rem)" }}
              >
                <div className="flex items-center gap-2">
                  <l.icon className="h-5 w-5 text-emerald-300" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-zinc-100">{l.title}</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {l.points.map((p) => (
                    <li key={p} className="text-sm leading-relaxed text-zinc-400">
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ))}
        </div>

        <div
          className="mt-6 border border-white/10 bg-white/5 p-1.5 shadow-[0_30px_80px_rgb(0_0_0/0.55)] backdrop-blur-2xl"
          style={{ borderRadius: "2rem" }}
        >
          <section
            className="border border-white/10 bg-[#0c0c0e]/90 p-6 shadow-[inset_0_1px_1px_rgb(255_255_255/0.15)] md:p-8"
            style={{ borderRadius: "calc(2rem - 0.375rem)" }}
          >
            <div className="flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-emerald-300" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-zinc-100">Project team</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { name: "Ayush Kumar", role: "Design and 3D interaction engineering" },
                { name: "Harsh Pratap", role: "AI context pipeline and application architecture" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="border border-white/10 bg-white/5 p-4 backdrop-blur-2xl"
                  style={{ borderRadius: "calc(2rem - 0.75rem)" }}
                >
                  <p className="font-display text-base font-semibold text-zinc-100">
                    {m.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12">
          <Link
            to="/explore/$sceneId"
            params={{ sceneId: "cathedral" }}
            className="ui-interactive group inline-flex cursor-pointer items-center gap-3 rounded-full bg-emerald-400 py-2 pr-2 pl-6 text-sm font-semibold text-emerald-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-300 active:scale-[0.98]"
          >
            Open the architecture module
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:scale-105">
              <IconArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
