import { CheckCircle2, Lightbulb, X, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { evaluateChallenge } from "@/lib/challenge-engine";
import { CHALLENGE_TYPE_LABEL } from "@/lib/challenges";
import type { Challenge, ChallengeAttempt } from "@/lib/tutor-contracts";

export type ChallengeOutcome = { challenge: Challenge; attempt: ChallengeAttempt };

type Props = {
  challenge: Challenge;
  selection: string | null;
  onConsumeSelection: () => void;
  onEmphasize: (ids: string[]) => void;
  onReveal: (ids: string[]) => void;
  onFocusStep: (ids: string[]) => void;
  onExit: () => void;
  onComplete: (outcome: ChallengeOutcome) => void;
};

export function ChallengeBar({
  challenge,
  selection,
  onConsumeSelection,
  onEmphasize,
  onReveal,
  onFocusStep,
  onExit,
  onComplete,
}: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const startedAt = useRef(Date.now());
  const expected = useMemo(() => challenge.expectedSequence ?? challenge.targetHotspotIds ?? [], [challenge]);
  const ordered = Boolean(challenge.expectedSequence);

  useEffect(() => {
    setPicked([]);
    setMisses(0);
    setFeedback(null);
    setFlash(null);
    startedAt.current = Date.now();
    // Announce each step spatially: narrow the field to this step's
    // candidates and glide the camera toward them.
    if (expected.length > 0) onFocusStep(expected.slice(0, 3));
    // Step changes carry new content; callback identities are stable dispatchers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id]);

  useEffect(() => {
    if (!selection) return;
    onConsumeSelection();
    const valid = ordered ? expected[picked.length] === selection : expected.includes(selection) && !picked.includes(selection);
    if (!valid) {
      const nextMisses = misses + 1;
      const hint = challenge.hints[Math.min(nextMisses - 1, challenge.hints.length - 1)]?.text;
      setMisses(nextMisses);
      setFeedback(hint ?? "Reconsider the prompt and try another visible structure.");
      setFlash("bad");
      if (nextMisses >= 3) onReveal(expected);
      window.setTimeout(() => setFlash(null), 850);
      return;
    }
    const nextPicked = [...picked, selection];
    setPicked(nextPicked);
    onEmphasize(nextPicked);
    if (nextPicked.length < expected.length) {
      const remaining = expected.length - nextPicked.length;
      setFeedback("Correct so far — " + remaining + " selection" + (remaining === 1 ? "" : "s") + " remaining.");
      setFlash("good");
      window.setTimeout(() => setFlash(null), 700);
      return;
    }
    const evaluation = evaluateChallenge({
      challenge,
      selectedHotspotIds: nextPicked,
      responseTimeMs: Date.now() - startedAt.current,
      attempts: misses + 1,
      hintCount: Math.min(misses, 3),
    });
    setFeedback(evaluation.feedback);
    setFlash("good");
    window.setTimeout(() => onComplete({ challenge, attempt: evaluation.attempt }), 700);
    // A selection is consumed once; callback identities do not affect scoring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  const progress = expected.length === 0 ? 0 : Math.round((picked.length / expected.length) * 100);
  const title =
    ordered
      ? "Trace " + Math.min(picked.length + 1, expected.length) + " of " + expected.length
      : expected.length > 1
        ? "Select " + expected.length + " structures"
        : "Select in the 3D model";
  const border =
    flash === "good"
      ? "border-emerald-400/70"
      : flash === "bad"
        ? "border-destructive/70"
        : "border-border/70";
  const pickedNames = (ids: string[]) =>
    ids
      .map((id) => expected.find((candidate) => candidate === id) ?? id)
      .map((id) => id.replace(/-/g, " "))
      .map((name) => name.replace(/\b\w/g, (letter) => letter.toUpperCase()))
      .join(" → ");

  return (
    <div role="region" aria-label={"Challenge: " + challenge.prompt} className={"pointer-events-auto absolute left-4 right-4 top-4 rounded-xl border bg-background/90 p-3 shadow-lg backdrop-blur-md transition-colors md:left-auto md:right-4 md:w-[390px] " + border}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="label-mono text-primary">{CHALLENGE_TYPE_LABEL[challenge.type]} · Difficulty {challenge.difficulty}</p>
          <p className="mt-1 font-display text-sm font-semibold">{title}</p>
        </div>
        <button onClick={onExit} aria-label="Exit challenge" className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: progress + "%" }} />
      </div>
      <p className="mt-3 text-sm leading-relaxed">{challenge.prompt}</p>
      {picked.length > 0 ? (
        <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-xs" aria-label="Your path so far">
          {picked.map((id, i) => (
            <li key={id + i} className="flex items-center gap-1.5">
              {i > 0 ? (
                <span aria-hidden className="text-muted-foreground">
                  →
                </span>
              ) : null}
              <span className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 font-medium text-emerald-300">
                {pickedNames([id])}
              </span>
            </li>
          ))}
          {ordered && picked.length < expected.length ? (
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="text-muted-foreground">
                →
              </span>
              <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-muted-foreground">
                {expected.length - picked.length} more
              </span>
            </li>
          ) : null}
        </ol>
      ) : null}
      {feedback ? (
        <p className={"mt-2 flex items-start gap-1.5 text-sm " + (flash === "bad" ? "text-amber-300" : "text-emerald-400")} role="status">
          {flash === "bad" ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          {feedback}
        </p>
      ) : (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"><Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />A wrong selection unlocks a progressively more specific hint.</p>
      )}
    </div>
  );
}
