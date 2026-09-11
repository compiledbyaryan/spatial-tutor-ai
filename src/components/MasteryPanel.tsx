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
      <div className="border border-[#EAEAEA] bg-white p-6" style={{ borderRadius: 8 }}>
        <h2 className="font-display text-xl font-semibold tracking-tight">Mastery</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#2F3437]">No attempts yet in {scene.title}. Complete a challenge to establish your first evidence-based mastery estimate.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-surface/60 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Mastery</h2>
        <span className="text-xs text-muted-foreground tabular-nums">{summary.totalAttempts} scored attempts</span>
      </div>
      <p className="mt-2 max-w-[62ch] text-sm font-medium leading-relaxed">{summary.sentence}</p>
      {summary.weakEvidence ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
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
                <dt className="text-xs text-[#787774]">
                  {AXIS_LABEL[axis]}
                  {weakest ? (
                    <span className="ml-1.5 bg-[#FBF3DB] px-1.5 py-px text-[11px] font-medium uppercase tracking-[0.05em] text-[#956400]" style={{ borderRadius: 9999 }}>
                      review next
                    </span>
                  ) : null}
                </dt>
                <dd className="text-xs font-semibold text-[#111111] tabular-nums">{level}%</dd>
              </div>
              <div
                className="mt-1.5 h-1 overflow-hidden bg-[#EAEAEA]" style={{ borderRadius: 9999 }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
                aria-label={`${AXIS_LABEL[axis]} mastery`}
              >
                <div
                  className="h-full bg-[#111111] transition-all duration-500"
                  style={{ width: level + "%" }}
                />
              </div>
            </div>
          );
        })}
      </dl>
      {summary.concepts.length > 0 ? (
        <div className="mt-6 border-t border-[#EAEAEA] pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">Weak concepts</h3>
          <ul className="mt-2 space-y-1">
            {summary.concepts.map((concept) => (
              <li key={concept.id} className="flex items-center justify-between gap-2 border-b border-[#EAEAEA] py-2 text-xs last:border-0">
                <span className="min-w-0 truncate text-[#2F3437]">{concept.name}</span>
                <span className="shrink-0 font-mono text-[#787774] tabular-nums">
                  {concept.level}% · {concept.attempts}
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
            className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 bg-[#111111] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#333333]"
            style={{ borderRadius: 6 }}
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
          className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 border border-[#EAEAEA] bg-white px-4 py-2 text-xs text-[#787774] hover:border-[#111111] hover:text-[#111111]"
          style={{ borderRadius: 6 }}
        >
          <IconReset className="h-4 w-4" /> Practice again
        </button>
      </div>
    </div>
  );
}
