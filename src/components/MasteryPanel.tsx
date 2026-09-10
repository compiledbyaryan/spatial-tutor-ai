import { ArrowRight, Award, RotateCcw } from "lucide-react";

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
      <div className="panel p-4">
        <p className="label-mono text-primary">Mastery</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No attempts yet in {scene.title}. Complete a challenge to establish your first evidence-based mastery estimate.</p>
      </div>
    );
  }

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="label-mono text-primary">Mastery</p>
        <span className="label-mono tabular-nums">{summary.totalAttempts} scored attempts</span>
      </div>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed">{summary.sentence}</p>
      {summary.weakEvidence ? (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Based on {summary.weakEvidence}
        </p>
      ) : null}
      <dl className="mt-3 space-y-2.5">
        {AXES.map((axis) => {
          const level = summary.levels[axis];
          const weakest = axis === summary.weakest;
          return (
            <div key={axis}>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs text-muted-foreground">
                  {AXIS_LABEL[axis]}
                  {weakest ? (
                    <span className="ml-1.5 rounded-full border border-accent/50 bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">
                      review next
                    </span>
                  ) : null}
                </dt>
                <dd className="font-mono text-xs text-foreground tabular-nums">{level}%</dd>
              </div>
              <div
                className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
                aria-label={`${AXIS_LABEL[axis]} mastery`}
              >
                <div
                  className={
                    "h-full rounded-full transition-all duration-500 " +
                    (weakest ? "bg-accent" : "bg-primary")
                  }
                  style={{ width: level + "%" }}
                />
              </div>
            </div>
          );
        })}
      </dl>
      {summary.concepts.length > 0 ? (
        <div className="mt-3 border-t border-border/70 pt-3">
          <p className="label-mono">Weak concepts</p>
          <ul className="mt-2 space-y-1">
            {summary.concepts.map((concept) => (
              <li key={concept.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="min-w-0 truncate text-foreground/90">{concept.name}</span>
                <span className="shrink-0 font-mono text-muted-foreground tabular-nums">
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
            className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Award className="h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-2 text-left">
              Review: {summary.recommended.prompt.slice(0, 64)}
              {summary.recommended.prompt.length > 64 ? "…" : ""}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        ) : null}
        <button
          onClick={onPracticeAgain}
          className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Practice again
        </button>
      </div>
    </div>
  );
}
