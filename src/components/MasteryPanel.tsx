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
      <div className="flex items-center justify-between">
        <p className="label-mono text-primary">Mastery</p>
        <span className="label-mono">{summary.totalAttempts} scored attempts</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{summary.sentence}</p>
      {summary.weakEvidence ? (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Based on {summary.weakEvidence}
        </p>
      ) : null}
      <dl className="mt-3 space-y-2">
        {AXES.map((axis) => (
          <div key={axis}>
            <div className="flex items-baseline justify-between gap-2"><dt className="text-xs text-muted-foreground">{AXIS_LABEL[axis]}</dt><dd className="font-mono text-xs text-foreground">{summary.levels[axis]}%</dd></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden><div className={"h-full rounded-full transition-all duration-500 " + (axis === summary.weakest ? "bg-accent" : "bg-primary")} style={{ width: summary.levels[axis] + "%" }} /></div>
          </div>
        ))}
      </dl>
      {summary.concepts.length > 0 ? (
        <div className="mt-3 border-t border-border/70 pt-3">
          <p className="label-mono">Weak concepts</p>
          <ul className="mt-2 space-y-1">{summary.concepts.map((concept) => <li key={concept.id} className="flex items-center justify-between text-xs"><span className="text-foreground/90">{concept.name}</span><span className="font-mono text-muted-foreground">{concept.level}% · {concept.attempts}</span></li>)}</ul>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-2">
        {summary.recommended ? (
          <button
            onClick={() => onReviewWeakArea(summary.recommended!)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Award className="h-4 w-4" /> Review: {summary.recommended.prompt.slice(0, 64)}
            {summary.recommended.prompt.length > 64 ? "…" : ""}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
        <button onClick={onPracticeAgain} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"><RotateCcw className="h-3.5 w-3.5" /> Practice again</button>
      </div>
    </div>
  );
}
