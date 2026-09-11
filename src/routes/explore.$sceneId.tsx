import { createFileRoute, notFound } from "@tanstack/react-router";

import { StudioView } from "@/components/StudioView";
import { getScene, scenes } from "@/lib/scenes";

export const Route = createFileRoute("/explore/$sceneId")({
  ssr: false,
  loader: ({ params }) => {
    const scene = getScene(params.sceneId);
    if (!scene) throw notFound();
    return { scene };
  },
  head: ({ loaderData }) => {
    const scene = loaderData?.scene;
    const title = scene ? `${scene.title}: SPATIA 3D Studio` : "Module unavailable: SPATIA";
    const description = scene
      ? `${scene.tagline}. Explore ${scene.title} in real-time 3D with an AI tutor that explains whatever structure you click.`
      : "This SPATIA learning module could not be loaded.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(scene ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: ModuleNotFound,
  component: ExplorePage,
});

function ModuleNotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold">Module not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Available modules: {scenes.map((s) => s.title).join(", ")}.
        </p>
      </div>
    </div>
  );
}

function ExplorePage() {
  const { scene } = Route.useLoaderData();
  return <StudioView scene={scene} />;
}
