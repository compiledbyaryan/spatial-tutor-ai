import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { IconBulb, IconEye, IconSend, IconSpark, IconTarget } from "@/components/icons";
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
      <p className="text-xs leading-relaxed text-[#71717a]">
        <span className="font-medium text-[#18181b]">{hotspotName ?? "Free navigation"}</span>
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
      className="animate-fade-swap text-xs leading-relaxed text-[#71717a]"
    >
      <span className="font-medium text-[#18181b]">{hotspotName ?? "Free navigation"}</span>
      <span className="mx-1.5 text-[#d4d4d8]" aria-hidden>|</span>
      {range} view from the {side}, {height}
    </p>
  );
}

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden border border-[#e4e4e7] bg-white"
      style={{ borderRadius: 8 }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#e4e4e7] px-6 py-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">Spatial AI Tutor</h2>
        <span className="font-mono text-xs text-[#71717a]">Knows your view</span>
      </div>

      <div className="flex items-start gap-2 border-b border-[#e4e4e7] bg-[#f4f4f5] px-6 py-3">
        <IconTarget className="mt-0.5 h-4 w-4 shrink-0" />
        <ViewpointLine hotspotName={hotspot ? hotspot.name : null} viewpoint={viewpoint} />
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {turns.length === 0 && !mutation.isPending ? (
          <div className="border border-dashed border-[#e4e4e7] px-6 py-8" style={{ borderRadius: 8 }}>
            <IconSpark className="h-5 w-5" />
            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-[#3f3f46]">
              Click any marker in the 3D model and I&apos;ll explain exactly what you&apos;re
              looking at from your angle. Or just ask me something
              about {scene.title}.
            </p>
          </div>
        ) : null}

        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <p
              key={i}
              className="ml-auto w-fit max-w-[85%] bg-[#18181b] px-3 py-2 text-sm font-medium text-white"
              style={{ borderRadius: 6 }}
            >
              {turn.content}
            </p>
          ) : (
            <article key={i} className="max-w-[95%] border-t border-[#e4e4e7] pt-4">
              {turn.focus ? (
                <h3 className="font-display text-lg font-semibold tracking-tight">{turn.focus}</h3>
              ) : null}
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[#3f3f46]">
                {turn.content}
              </p>
              {turn.followUp ? (
                <button
                  onClick={() => submit(turn.followUp!)}
                  disabled={mutation.isPending}
                  title="Ask the tutor this follow-up question"
                  className="ui-interactive mt-3 inline-flex cursor-pointer items-center gap-1.5 border border-[#e4e4e7] bg-[#f4f4f5] px-2.5 py-1.5 text-left text-xs text-[#3f3f46] hover:border-[#18181b] disabled:opacity-50"
                  style={{ borderRadius: 6 }}
                >
                  <IconSpark className="h-3.5 w-3.5 shrink-0" />
                  {turn.followUp}
                </button>
              ) : null}
              {turn.mode && turn.mode !== "live" ? (
                <p className="mt-2 inline-block bg-[#E1F3FE] px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.05em] text-[#1F6C9F]" style={{ borderRadius: 9999 }}>
                  {turn.mode === "demo" ? "guided demo answer" : "offline answer"}
                </p>
              ) : null}
            </article>
          ),
        )}

        {mutation.isPending ? (
          <div className="space-y-2" role="status" aria-label="Tutor is reading your viewpoint">
            <div className="h-3 w-3/4 animate-pulse bg-[#f4f4f5]" style={{ borderRadius: 4 }} />
            <div className="h-3 w-full animate-pulse bg-[#f4f4f5]" style={{ borderRadius: 4 }} />
            <div className="h-3 w-2/3 animate-pulse bg-[#f4f4f5]" style={{ borderRadius: 4 }} />
            <p className="flex items-center gap-2 pt-1 text-xs text-[#71717a]">
              <IconSpark className="h-4 w-4 animate-spin" />
              Reading your viewpoint…
            </p>
          </div>
        ) : null}

        {mutation.isError ? (
          <div
            className="border border-[#e4e4e7] bg-[#FDEBEC] px-4 py-3 text-sm"
            style={{ borderRadius: 8 }}
            role="alert"
          >
            <p className="text-[#9F2F2D]">{(mutation.error as Error).message}</p>
            {onStartChallenge ? (
              <button
                onClick={() => onStartChallenge()}
                className="ui-interactive mt-2 inline-flex cursor-pointer items-center gap-1.5 border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-xs text-[#3f3f46] hover:border-[#18181b]"
                style={{ borderRadius: 6 }}
              >
                <IconBulb className="h-4 w-4" /> The tutor is offline. Practice
                in 3D instead
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#e4e4e7] px-6 py-4">
        {onStageCompare && scene.id === "cardiac" ? (
          <button
            onClick={() => {
              submit("Why is the left ventricle thicker than the right?");
            }}
            disabled={mutation.isPending}
            title="Stage the ventricle comparison and ask the canonical question"
            className="ui-interactive mb-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border border-[#18181b] bg-white px-3 py-2 text-xs font-semibold text-[#18181b] hover:bg-[#f4f4f5] disabled:opacity-50"
            style={{ borderRadius: 6 }}
          >
            <IconEye className="h-4 w-4" /> Show me: why is the left ventricle
            thicker?
          </button>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={mutation.isPending}
              className="ui-interactive cursor-pointer border border-[#e4e4e7] bg-white px-2.5 py-1 text-xs text-[#71717a] hover:border-[#18181b] hover:text-[#18181b] disabled:opacity-50"
              style={{ borderRadius: 6 }}
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
            className="min-w-0 flex-1 border border-[#e4e4e7] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#71717a] focus:border-[#18181b]"
            style={{ borderRadius: 6 }}
          />
          <button
            type="submit"
            disabled={mutation.isPending || !draft.trim()}
            className="ui-interactive inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center bg-[#18181b] text-white hover:bg-[#27272a] disabled:opacity-40"
            style={{ borderRadius: 6 }}
            aria-label="Send question"
          >
            <IconSend className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
