import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Loader2, Send, Sparkles, Crosshair, Swords } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { askTutor } from "@/lib/tutor.functions";
import type { Hotspot, SceneModule } from "@/lib/scenes";
import type { Challenge, ChallengeAttempt, MasterySummary, SceneAction, TutorResponse } from "@/lib/tutor-contracts";
import type { Viewpoint } from "./scene/SceneCanvas";

type Turn = { role: "user" | "assistant"; content: string; focus?: string; mode?: TutorResponse["mode"] };

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
      const focus = reply.focus ? scene.hotspots.find((item) => item.id === reply.focus)?.name ?? reply.focus : undefined;
      setTurns((t) => [
        ...t,
        { role: "assistant", content: reply.answer, mode: reply.mode, ...(focus ? { focus } : {}) },
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

  return (
    <div className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-display text-sm font-semibold">Spatial AI Tutor</span>
        </div>
        <span className="label-mono">context aware</span>
      </div>

      <div className="flex items-start gap-2 border-b border-border/70 bg-secondary/40 px-4 py-2.5">
        <Crosshair className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="text-foreground">{hotspot ? hotspot.name : "Free navigation"}</span>
          {viewpoint ? (
            <>
              {" · "}
              {viewpoint.distance.toFixed(1)}u ·{" "}
              {`az ${Math.round(((((viewpoint.azimuth * 180) / Math.PI) % 360) + 360) % 360)}°`} ·{" "}
              {`el ${Math.round(90 - (viewpoint.polar * 180) / Math.PI)}°`}
            </>
          ) : null}
        </p>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {turns.length === 0 && !mutation.isPending ? (
          <div className="rounded-lg border border-dashed border-border/80 bg-background/40 p-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Click any marker in the 3D model and I'll explain exactly what you're looking at —
              from the angle you're looking at it. Or just ask me something about {scene.title}.
            </p>
          </div>
        ) : null}

        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <div
              key={i}
              className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-primary/15 px-3 py-2 text-sm text-foreground"
            >
              {turn.content}
            </div>
          ) : (
            <div
              key={i}
              className="max-w-[95%] rounded-lg rounded-bl-sm border border-border/70 bg-surface-raised/70 px-3 py-2.5"
            >
              {turn.focus ? <p className="label-mono mb-1.5">{turn.focus}</p> : null}
              <p className="text-sm leading-relaxed text-foreground/90">{turn.content}</p>
              {turn.mode && turn.mode !== "live" ? (
                <p className="label-mono mt-2 inline-block rounded-full border border-border/60 px-2 py-0.5">
                  {turn.mode === "demo" ? "guided demo answer" : "offline answer"}
                </p>
              ) : null}
            </div>
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
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm">
            <p className="text-destructive-foreground">{(mutation.error as Error).message}</p>
            {onStartChallenge ? (
              <button
                onClick={() => onStartChallenge()}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Swords className="h-3.5 w-3.5" /> The tutor is offline — practice in 3D instead
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
            className="mb-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-accent/50 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/15 disabled:opacity-50"
          >
            <Eye className="h-3.5 w-3.5" /> Show me: why is the left ventricle thicker?
          </button>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={mutation.isPending}
              className="rounded-full border border-border/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary disabled:opacity-50"
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
            className="min-w-0 flex-1 rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/70"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !draft.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
