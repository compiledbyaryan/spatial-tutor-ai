import { ArrowRight, Award, RotateCcw } from "lucide-react";

import { AXIS_LABEL, buildAdaptedChallenge, type SkillAxis } from "@/lib/challenges";
import { summarizeMastery } from "@/lib/mastery";
import type { SceneModule } from "@/lib/scenes";

type Props = {
  scene: SceneModule;
  onReviewWeakArea: (challengeId: string) => void;
  onPracticeAgain: () => void;
};

const AXES: SkillAxis[] = ["identification", "function", "spatial", "flow"];

export function MasteryPanel({ scene, onReviewWeakArea, onPracticeAgain }: Props) {
  const summary = summarizeMastery(scene);

  if (!summary) {
    return (
      <div className="panel p-4">
        <p className="label-mono text-primary">Mastery</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No attempts yet in {scene.title}. Run a challenge and this panel will show where you stand
          — and what to review next.
        </p>
      </div>
    );
  }

  const adapted = buildAdaptedChallenge(scene.id, summary.weakest);

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="label-mono text-primary">Mastery</p>
        <span className="label-mono">{summary.totalAsked} attempts</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed">{summary.sentence}</p>

      <dl className="mt-3 space-y-2">
        {AXES.map((axis) => {
          const level = summary.levels[axis];
          return (
            <div key={axis}>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-xs text-muted-foreground">{AXIS_LABEL[axis]}</dt>
                <dd className="font-mono text-xs text-foreground">{level}%</dd>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    axis === summary.weakest ? "bg-accent" : "bg-primary"
                  }`}
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          );
        })}
      </dl>

      {summary.concepts.length > 0 ? (
        <div className="mt-3 border-t border-border/70 pt-3">
          <p className="label-mono">Structures practiced</p>
          <ul className="mt-2 space-y-1">
            {summary.concepts.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-xs">
                <span className="text-foreground/90">{c.name}</span>
                <span className="font-mono text-muted-foreground">
                  {c.level}% · {c.asked}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        {adapted ? (
          <button
            onClick={() => onReviewWeakArea(adapted.id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Award className="h-4 w-4" /> Review weak area:{" "}
            {AXIS_LABEL[summary.weakest].toLowerCase()}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
        <button
          onClick={onPracticeAgain}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Practice again
        </button>
      </div>
    </div>
  );
}
