import { CheckCircle2, Flag, Lightbulb, X, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FAMILY_LABEL, type Challenge } from "@/lib/challenges";
import { recordStep } from "@/lib/mastery";

export type ChallengeOutcome = {
  challenge: Challenge;
  stepsCorrectFirstTry: number;
  hintsUsed: number;
};

type Props = {
  sceneId: string;
  challenge: Challenge;
  /** Hotspot the learner just clicked in the 3D view (or null). Consumed once. */
  selection: string | null;
  onConsumeSelection: () => void;
  onFocusHotspot: (id: string) => void;
  onNarrow: (ids: string[]) => void;
  onReveal: (ids: string[]) => void;
  onExit: () => void;
  onComplete: (outcome: ChallengeOutcome) => void;
};

/** Never reveal the answer on a miss: hint 1 narrows the field, hint 2 frames it, reveal comes last. */
export function ChallengeBar({
  sceneId,
  challenge,
  selection,
  onConsumeSelection,
  onFocusHotspot,
  onNarrow,
  onReveal,
  onExit,
  onComplete,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [done, setDone] = useState(false);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);

  const step = challenge.steps[stepIndex];
  const total = challenge.steps.length;
  const hintLevel = Math.min(misses, 2);

  const narrowed = useMemo(() => {
    if (!step) return null;
    if (misses >= 1 && step.narrow && step.narrow.length > 0) return step.narrow;
    return null;
  }, [step, misses]);

  // Keep the 3D view synced: focus the first candidate, then the narrowed set.
  useEffect(() => {
    if (!step || done) return;
    if (narrowed) onNarrow(narrowed);
    else if (step.targets[0]) onFocusHotspot(step.targets[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, challenge.id, done]);

  useEffect(() => {
    if (narrowed) onNarrow(narrowed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [misses]);

  // Consume 3D selections as challenge answers.
  useEffect(() => {
    if (!selection || !step || done) return;
    onConsumeSelection();
    const correct = step.targets.includes(selection);
    if (correct) {
      const clean = misses === 0;
      recordStep(sceneId, step.axis, step.targets, clean);
      setFirstTry((f) => [...f, clean]);
      setFlash("good");
      window.setTimeout(() => {
        setFlash(null);
        setMisses(0);
        if (stepIndex + 1 >= total) {
          setDone(true);
        } else {
          setStepIndex((i) => i + 1);
        }
      }, 900);
    } else {
      setMisses((m) => m + 1);
      setFlash("bad");
      window.setTimeout(() => setFlash(null), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  // Report the outcome once the final step lands.
  useEffect(() => {
    if (!done) return;
    onComplete({
      challenge,
      stepsCorrectFirstTry: firstTry.filter(Boolean).length,
      hintsUsed: total - firstTry.filter(Boolean).length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!step) return null;

  const hintCopy =
    hintLevel === 0
      ? "Wrong picks narrow the field — the answer is never shown outright."
      : hintLevel === 1 && narrowed
        ? "Narrowed: the answer is one of the glowing markers."
        : "Look for the structure that fits the spatial clue in the prompt.";

  return (
    <div
      role="region"
      aria-label={`Challenge: ${challenge.title}`}
      className={`pointer-events-auto absolute left-4 right-4 top-4 rounded-xl border bg-background/90 p-3 shadow-lg backdrop-blur-md transition-colors md:left-auto md:right-4 md:w-[380px] ${
        flash === "good"
          ? "border-emerald-400/70"
          : flash === "bad"
            ? "border-destructive/70"
            : "border-border/70"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="label-mono text-primary">
            {FAMILY_LABEL[challenge.family]} · Step {Math.min(stepIndex + 1, total)} of {total}
          </p>
          <p className="mt-1 font-display text-sm font-semibold">{challenge.title}</p>
        </div>
        <button
          onClick={onExit}
          aria-label="Exit challenge"
          className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(stepIndex / total) * 100}%` }}
        />
      </div>

      {done ? (
        <div className="mt-3 flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-sm leading-relaxed">{step.success}</p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed">{step.prompt}</p>
          {flash === "good" ? (
            <p
              className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-400"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4" /> {step.success}
            </p>
          ) : null}
          {flash === "bad" && misses < 3 ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-300" role="status">
              <XCircle className="h-4 w-4" /> Not that one —{" "}
              {misses === 1 ? "the field is narrowed." : "read the spatial clue again."}
            </p>
          ) : null}
          {flash === "bad" && misses >= 3 ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground" role="status">
              {step.reveal}
            </p>
          ) : null}
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            {hintCopy}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => step.targets[0] && onFocusHotspot(step.targets[0])}
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Flag className="mr-1 inline h-3 w-3" /> Re-center view
            </button>
            {narrowed ? (
              <button
                onClick={() => onReveal(narrowed)}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Highlight candidates
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
