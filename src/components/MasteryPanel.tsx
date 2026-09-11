import { IconArrow, IconAward, IconReset } from "@/components/icons";

import { AXIS_LABEL, summarizeMastery, type MasteryAxis } from "@/lib/mastery";
import type { SceneModule } from "@/lib/scenes";
import type { Challenge, MasteryProfile } from "@/lib/tutor-contracts";

type Props = {
  scene: SceneModule;
  profile: MasteryProfile;
  onReviewWeakArea: (challenge: Challenge) => void;
  onPracticeAgain: () => void;
};

const AXES: MasteryAxis[] = ["identification", "function", "spatialRelation", "flowReasoning"];

export function MasteryPanel({ scene, profile, onReviewWeakArea, onPracticeAgain }: Props) {
  const summary = summarizeMastery(profile, scene);
  if (!summary) {
    return (
      <div className="border border-white/10 bg-white/5 p-6 backdrop-blur-2xl" style={{ borderRadius: "2rem" }}>
        <h2 className="font-display text-xl font-semibold tracking-tight">Mastery</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">No attempts yet in {scene.title}. Complete a challenge to establish your first evidence-based mastery estimate.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/5 p-1.5 shadow-[0_30px_80px_rgb(0_0_0/0.55)] backdrop-blur-2xl" style={{ borderRadius: "2rem" }}><div className="border border-white/10 bg-[#0c0c0e]/90 p-5 shadow-[inset_0_1px_1px_rgb(255_255_255/0.15)]" style={{ borderRadius: "calc(2rem - 0.375rem)" }}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Mastery</h2>
        <span className="text-xs text-zinc-500 tabular-nums">{summary.totalAttempts} scored attempts</span>
      </div>
      <p className="mt-2 max-w-[62ch] text-sm font-medium leading-relaxed">{summary.sentence}</p>
      {summary.weakEvidence ? (
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Based on {summary.weakEvidence}
        </p>
      ) : null}
      <dl className="mt-4 space-y-2.5">
        {AXES.map((axis) => {
          const level = summary.levels[axis];
          const weakest = axis === summary.weakest;
          return (
            <div key={axis}>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs text-zinc-400">
                  {AXIS_LABEL[axis]}
                  {weakest ? (
                    <span className="ml-1.5 bg-amber-400/10 px-1.5 py-px text-[11px] font-medium uppercase tracking-[0.05em] text-amber-300" style={{ borderRadius: 9999 }}>
                      review next
                    </span>
                  ) : null}
                </dt>
                <dd className="text-xs font-semibold text-zinc-100 tabular-nums">{level}%</dd>
              </div>
              <div
                className="mt-1.5 h-1 overflow-hidden bg-white/10" style={{ borderRadius: 9999 }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
                aria-label={`${AXIS_LABEL[axis]} mastery`}
              >
                <div
                  className="h-full bg-emerald-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ width: level + "%" }}
                />
              </div>
            </div>
          );
        })}
      </dl>
      {summary.concepts.length > 0 ? (
        <div className="mt-6 border-t border-white/10 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Weak concepts</h3>
          <ul className="mt-2 space-y-1">
            {summary.concepts.map((concept) => (
              <li key={concept.id} className="flex items-center justify-between gap-2 border-b border-white/10 py-2 text-xs last:border-0">
                <span className="min-w-0 truncate text-zinc-300">{concept.name}</span>
                <span className="shrink-0 font-mono text-zinc-500 tabular-nums">
                  {concept.level}% ({concept.attempts})
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2">
        {summary.recommended ? (
          <button
            onClick={() => onReviewWeakArea(summary.recommended!)}
            title={`Start the recommended review challenge: ${summary.recommended.prompt}`}
            className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-300 active:scale-[0.98]"
            style={{ borderRadius: 9999 }}
          >
            <IconAward className="h-4 w-4 shrink-0" />
            <span className="line-clamp-2 text-left">
              Review: {summary.recommended.prompt.slice(0, 64)}
              {summary.recommended.prompt.length > 64 ? "…" : ""}
            </span>
            <IconArrow className="h-4 w-4 shrink-0" />
          </button>
        ) : null}
        <button
          onClick={onPracticeAgain}
          className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 hover:border-emerald-300/50 hover:text-white active:scale-[0.98]"
          style={{ borderRadius: 9999 }}
        >
          <IconReset className="h-4 w-4" /> Practice again
        </button>
      </div>
      </div>
    </div>
  );
}
