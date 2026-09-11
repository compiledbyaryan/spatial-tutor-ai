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
      <div className="border border-[#2a2a2a] bg-[#111111] p-6" >
        <h2 className="font-display text-xl font-black uppercase">MASTERY</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#eaeaea]">No attempts yet in {scene.title}. Complete a challenge to establish your first evidence-based mastery estimate.</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-[#eaeaea] bg-[#0a0a0a] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-black uppercase">MASTERY</h2>
        <samp className="font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] tabular-nums uppercase">[{summary.totalAttempts} SCORED]</samp>
      </div>
      <output className="mt-2 block max-w-[62ch] font-mono text-xs leading-relaxed tracking-[0.03em] text-[#eaeaea] uppercase">{summary.sentence}</output>
      {summary.weakEvidence ? (
        <p className="mt-1 text-xs leading-relaxed text-[#9a9a9a]">
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
                <dt className="text-xs text-[#9a9a9a]">
                  {AXIS_LABEL[axis]}
                  {weakest ? (
                    <span className="ml-1.5 bg-[#161616] px-1.5 py-px text-[11px] font-medium uppercase tracking-[0.05em] text-[#e61919]" >
                      [ REVIEW NEXT ]
                    </span>
                  ) : null}
                </dt>
                <dd className="text-xs font-semibold text-[#eaeaea] tabular-nums">{level}%</dd>
              </div>
              <div
                className="mt-1.5 h-1 overflow-hidden bg-[#2a2a2a]" 
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
                aria-label={`${AXIS_LABEL[axis]} mastery`}
              >
                <div
                  className="h-full bg-[#e61919]"
                  style={{ width: level + "%" }}
                />
              </div>
            </div>
          );
        })}
      </dl>
      {summary.concepts.length > 0 ? (
        <div className="mt-6 border-t border-[#2a2a2a] pt-4">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a9a9a]">WEAK CONCEPTS</h3>
          <ul className="mt-2 space-y-1">
            {summary.concepts.map((concept) => (
              <li key={concept.id} className="flex items-center justify-between gap-2 border-b border-[#2a2a2a] py-2 text-xs last:border-0">
                <span className="min-w-0 truncate text-[#eaeaea]">{concept.name}</span>
                <span className="shrink-0 font-mono text-[#9a9a9a] tabular-nums">
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
            className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 bg-[#e61919] px-4 py-2.5 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a]"
            
          >
            <IconAward className="h-4 w-4 shrink-0" />
            <span className="line-clamp-2 text-left">
              REVIEW: {summary.recommended.prompt.slice(0, 64).toUpperCase()}
              {summary.recommended.prompt.length > 64 ? "…" : ""}
            </span>
            <IconArrow className="h-4 w-4 shrink-0" />
          </button>
        ) : null}
        <button
          onClick={onPracticeAgain}
          className="ui-interactive inline-flex cursor-pointer items-center justify-center gap-1.5 border border-[#2a2a2a] bg-[#111111] px-4 py-2 font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase hover:border-[#e61919] hover:text-[#eaeaea]"
          
        >
          <IconReset className="h-4 w-4" /> PRACTICE AGAIN
        </button>
      </div>
    </div>
  );
}
