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
  onExit: () => void;
  onComplete: (outcome: ChallengeOutcome) => void;
};

export function ChallengeBar({ challenge, selection, onConsumeSelection, onEmphasize, onReveal, onExit, onComplete }: Props) {
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
  const title = ordered ? "Trace " + Math.min(picked.length + 1, expected.length) + " of " + expected.length : expected.length > 1 ? "Select " + expected.length + " structures" : "Select in the 3D model";
  const border = flash === "good" ? "border-emerald-400/70" : flash === "bad" ? "border-destructive/70" : "border-border/70";

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
      {picked.length > 0 ? <p className="mt-2 text-xs text-muted-foreground">Selected: {picked.join(" → ")}</p> : null}
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
