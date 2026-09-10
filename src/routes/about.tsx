import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Layers3, Radar, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How SPATIA Works — Architecture & Team" },
      {
        name: "description",
        content:
          "The engineering behind SPATIA: a React Three Fiber rendering pipeline, viewpoint telemetry, and a server-side AI tutor grounded in per-structure datasets.",
      },
      { property: "og:title", content: "How SPATIA Works — Architecture & Team" },
      {
        property: "og:description",
        content: "Rendering pipeline, viewpoint telemetry and grounded AI tutoring, explained. By Ayush Kumar and Harsh Pratap.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const layers = [
  {
    icon: Layers3,
    title: "Rendering layer",
    points: [
      "React Three Fiber over WebGL2, one shadow-casting directional light plus local Lightformer IBL — no CDN HDR fetches.",
      "Models are procedural: Catmull-Rom tube geometry for great vessels and Gothic ribs, physical materials with clearcoat and sheen for tissue.",
      "Pixel ratio capped at 2, 2048px shadow map, geometry reused across markers to stay inside a mobile draw budget.",
    ],
  },
  {
    icon: Radar,
    title: "Spatial context layer",
    points: [
      "A tracker samples the camera every 320 ms and derives distance, orbit azimuth and polar elevation, emitting only on meaningful change.",
      "Raycast picks resolve to a hotspot id with a curated dataset: category, summary and verified key facts.",
      "Telemetry is translated into natural language (\"left side, from above, medium range\") before it reaches the model.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "AI layer",
    points: [
      "A TanStack server function owns the model call; the API key never touches the browser bundle.",
      "The prompt carries module pedagogy, the full element inventory, the selected structure's dataset and the viewpoint description.",
      "Structured replies validate against a shared contract; when inference is unavailable a deterministic offline answer uses the same shape.",
    ],
  },
];

function About() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <p className="label-mono mt-8 text-primary">Technical write-up</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Three layers, one continuous learning loop</h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        SPATIA is deliberately lightweight: no native app, no headset, no asset pipeline to install. Everything runs in a
        browser tab, which is what makes it deployable to a classroom of mixed devices while still delivering a
        genuinely spatial experience.
      </p>

      <div className="mt-12 space-y-5">
        {layers.map((l) => (
          <section key={l.title} className="panel p-6">
            <div className="flex items-center gap-2">
              <l.icon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{l.title}</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {l.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel mt-8 p-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Project team</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { name: "Ayush Kumar", role: "Design & 3D interaction engineering" },
            { name: "Harsh Pratap", role: "AI context pipeline & application architecture" },
          ].map((m) => (
            <div key={m.name} className="rounded-xl border border-border/70 bg-background/40 p-4">
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
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Open the architecture module
        </Link>
      </div>
    </main>
  );
}
