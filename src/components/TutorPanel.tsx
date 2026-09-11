import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Loader2, Send, Sparkles, Crosshair, Swords } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { askTutor } from "@/lib/tutor.functions";
import type { Hotspot, SceneModule } from "@/lib/scenes";
import type { Challenge, ChallengeAttempt, MasterySummary, SceneAction, TutorResponse } from "@/lib/tutor-contracts";
import type { Viewpoint } from "./scene/SceneCanvas";

type Turn = {
  role: "user" | "assistant";
  content: string;
  focus?: string;
  mode?: TutorResponse["mode"];
  followUp?: string;
};

type Props = {
  scene: SceneModule;
  hotspot: Hotspot | null;
  viewpoint: Viewpoint | null;
  onSceneActions?: (actions: SceneAction[]) => void;
  /** Heart flagship: stages the LV-vs-RV compare view for the canonical question. */
  onStageCompare?: (() => void) | undefined;
  /** Enters a canonical challenge returned by the tutor, or the scene default. */
  onStartChallenge?: ((challenge?: Challenge) => void) | undefined;
  masterySummary?: MasterySummary | undefined;
  recentChallengeAttempts?: ChallengeAttempt[] | undefined;
  recentMisconceptions?: string[] | undefined;
};

const COMPARE_QUESTION = /thicker|compare|left ventricle.*right|right.*left ventricle/i;

export function TutorPanel({ scene, hotspot, viewpoint, onSceneActions, onStageCompare, onStartChallenge, masterySummary, recentChallengeAttempts, recentMisconceptions }: Props) {
  const ask = useServerFn(askTutor);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const lastAuto = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: (vars: { question?: string | undefined; hotspotId?: string | undefined }) =>
      ask({
        data: {
          sceneId: scene.id,
          hotspotId: vars.hotspotId,
          question: vars.question,
          viewpoint: viewpoint ?? undefined,
          history: turns.slice(-6).map(({ role, content }) => ({ role, content })),
          masterySummary,
          recentChallengeAttempts: recentChallengeAttempts?.slice(-8),
          recentMisconceptions: recentMisconceptions?.slice(-6),
        },
      }),
    onSuccess: (reply) => {
      const focus = reply.focus
        ? (scene.hotspots.find((item) => item.id === reply.focus)?.name ?? reply.focus)
        : undefined;
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content: reply.answer,
          mode: reply.mode,
          ...(focus ? { focus } : {}),
          ...(reply.followUp ? { followUp: reply.followUp } : {}),
        },
      ]);
      onSceneActions?.(reply.actions);
      if (reply.challenge) onStartChallenge?.(reply.challenge);
    },
  });

  // Auto-brief whenever the student clicks a new structure in the 3D scene.
  useEffect(() => {
    if (!hotspot || lastAuto.current === hotspot.id) return;
    lastAuto.current = hotspot.id;
    setTurns((t) => [...t, { role: "user", content: `Selected: ${hotspot.name}` }]);
    mutation.mutate({ hotspotId: hotspot.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotspot?.id]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns, mutation.isPending]);

  function submit(question: string) {
    const q = question.trim();
    if (!q || mutation.isPending) return;
    // Deterministic local staging for the flagship compare question:
    // works with or without the live LLM.
    if (onStageCompare && COMPARE_QUESTION.test(q)) onStageCompare();
    setTurns((t) => [...t, { role: "user", content: q }]);
    setDraft("");
    mutation.mutate({ question: q, hotspotId: hotspot?.id });
  }

  const suggestions = hotspot
    ? [
        `Why is it shaped this way?`,
        `How does it relate to what's next to it?`,
        ...(scene.id === "cardiac" && hotspot.id !== "left-ventricle"
          ? [`Why is the left ventricle thicker than the right?`]
          : []),
        `Quiz me on this structure`,
      ].slice(0, 3)
    : [`Orient me in this model`, `What should I look at first?`, `Give me a 30-second overview`];

function ViewpointLine({
  hotspotName,
  viewpoint,
}: {
  hotspotName: string | null;
  viewpoint: Viewpoint | null;
}) {
  if (!viewpoint) {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">{hotspotName ?? "Free navigation"}</span>
      </p>
    );
  }
  const deg = (r: number) => Math.round((r * 180) / Math.PI);
  const az = ((deg(viewpoint.azimuth) % 360) + 360) % 360;
  const side = az < 45 || az >= 315 ? "front" : az < 135 ? "right side" : az < 225 ? "back" : "left side";
  const height = deg(viewpoint.polar) < 55 ? "above" : deg(viewpoint.polar) > 110 ? "below" : "level";
  const range = viewpoint.distance < 4 ? "Close up" : viewpoint.distance < 9 ? "Mid-range" : "Wide";
  return (
    <p
      key={`${hotspotName ?? "free"}-${side}-${height}-${range}`}
      className="animate-fade-swap text-xs leading-relaxed text-muted-foreground"
    >
      <span className="text-foreground">{hotspotName ?? "Free navigation"}</span>
      {" · "}
      {range} view from the {side}, {height}
    </p>
  );
}

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-surface/60">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Spatial AI Tutor
        </h2>
        <span className="text-xs text-muted-foreground">Knows your view</span>
      </div>

      <div className="flex items-start gap-2 border-b border-border/70 bg-secondary/40 px-4 py-2.5">
        <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <ViewpointLine hotspotName={hotspot ? hotspot.name : null} viewpoint={viewpoint} />
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {turns.length === 0 && !mutation.isPending ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-5">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              Click any marker in the 3D model and I&apos;ll explain exactly what you&apos;re
              looking at — from the angle you&apos;re looking at it. Or just ask me something
              about {scene.title}.
            </p>
          </div>
        ) : null}

        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <p
              key={i}
              className="ml-auto w-fit max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              {turn.content}
            </p>
          ) : (
            <article key={i} className="max-w-[95%] border-l-2 border-primary/50 pl-3">
              {turn.focus ? (
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                  {turn.focus}
                </h3>
              ) : null}
              <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-foreground/90">
                {turn.content}
              </p>
              {turn.followUp ? (
                <button
                  onClick={() => submit(turn.followUp!)}
                  disabled={mutation.isPending}
                  title="Ask the tutor this follow-up question"
                  className="ui-interactive mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-left text-xs font-semibold text-primary hover:bg-primary/15 disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                  {turn.followUp}
                </button>
              ) : null}
              {turn.mode && turn.mode !== "live" ? (
                <p className="mt-2 inline-block rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {turn.mode === "demo" ? "guided demo answer" : "offline answer"}
                </p>
              ) : null}
            </article>
          ),
        )}

        {mutation.isPending ? (
          <div className="space-y-2" role="status" aria-label="Tutor is reading your viewpoint">
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-secondary" />
            <div className="h-3 w-full animate-pulse rounded-full bg-secondary" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-secondary" />
            <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              Reading your viewpoint…
            </p>
          </div>
        ) : null}

        {mutation.isError ? (
          <div
            className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm"
            role="alert"
          >
            <p className="text-destructive-foreground">{(mutation.error as Error).message}</p>
            {onStartChallenge ? (
              <button
                onClick={() => onStartChallenge()}
                className="ui-interactive mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:border-primary/60 hover:text-primary"
              >
                <Swords className="h-3.5 w-3.5" aria-hidden /> The tutor is offline — practice
                in 3D instead
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border/70 px-4 py-3">
        {onStageCompare && scene.id === "cardiac" ? (
          <button
            onClick={() => {
              submit("Why is the left ventricle thicker than the right?");
            }}
            disabled={mutation.isPending}
            title="Stage the ventricle comparison and ask the canonical question"
            className="ui-interactive mb-2 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15 disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden /> Show me: why is the left ventricle
            thicker?
          </button>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={mutation.isPending}
              className="ui-interactive cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about what you're seeing…"
            aria-label="Ask the tutor about this scene"
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !draft.trim()}
            className="ui-interactive inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40"
            aria-label="Send question"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
}
