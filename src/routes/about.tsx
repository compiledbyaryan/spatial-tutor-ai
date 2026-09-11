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
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <IconArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Back to library
      </Link>

      <h1 className="mt-8 text-4xl font-bold tracking-tighter text-balance md:text-5xl">
        Three layers, one continuous learning loop
      </h1>
      <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-gray-600">
        SPATIA is deliberately lightweight: no native app, no headset, no asset pipeline
        to install. Everything runs in a browser tab, which is what makes it deployable to
        a classroom of mixed devices while still delivering a genuinely spatial
        experience.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {layers.map((l) => (
          <section
            key={l.title}
            className="border border-border/70 bg-surface p-6"
            style={{ borderRadius: 16 }}
          >
            <div className="flex items-center gap-2">
              <l.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <h2 className="text-lg font-semibold">{l.title}</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {l.points.map((p) => (
                <li
                  key={p}
                  className="text-sm leading-relaxed text-gray-600"
                >
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section
        className="mt-4 border border-border/70 bg-surface/60 p-6 md:p-8"
        style={{ borderRadius: 16 }}
      >
        <div className="flex items-center gap-2">
          <IconUsers className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold">Project team</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { name: "Ayush Kumar", role: "Design and 3D interaction engineering" },
            { name: "Harsh Pratap", role: "AI context pipeline and application architecture" },
          ].map((m) => (
            <div
              key={m.name}
              className="border border-border/70 bg-background/60 p-4"
              style={{ borderRadius: 12 }}
            >
              <p className="font-display text-base font-semibold">{m.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <Link
          to="/explore/$sceneId"
          params={{ sceneId: "cathedral" }}
          className="inline-flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]"
          style={{ borderRadius: 12 }}
        >
          Open the architecture module
          <IconArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </main>
  );
}
