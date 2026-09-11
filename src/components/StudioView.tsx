import { Link } from "@tanstack/react-router";
import { IconBack, IconLayers, IconOrbit, IconReset, IconSwords } from "@/components/icons";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { ChallengeBar, type ChallengeOutcome } from "./ChallengeBar";
import { MasteryPanel } from "./MasteryPanel";
import { SceneCanvas, type Viewpoint } from "./scene/SceneCanvas";
import { TutorPanel } from "./TutorPanel";
import { useSceneController } from "@/hooks/useSceneController";
import {
  challengesForScene,
  type Challenge,
} from "@/lib/challenges";
import { addLearningEvent, loadLearning, recordChallengeResult } from "@/lib/mastery";
import { inferLearningSignals } from "@/lib/misconceptions";
import { MODEL_EMPHASIS_SCENES } from "@/lib/scene-actions";
import type { SceneModule } from "@/lib/scenes";
import type { SceneAction } from "@/lib/tutor-contracts";

const SCENE_TOGGLES: Record<string, { key: string; label: string }[]> = {
  cardiac: [{ key: "pulse", label: "Cardiac cycle animation" }],
  caffeine: [{ key: "hydrogens", label: "Show hydrogen atoms" }],
  cathedral: [{ key: "vault", label: "Show rib vault" }],
  dna: [{ key: "unwind", label: "Tighten the helix" }],
  "wave-interference": [{ key: "twoSources", label: "Second wave source" }],
  lattice: [{ key: "bonds", label: "Show ionic bonds" }],
};

type Mode = "explore" | "challenge" | "mastery";

export function StudioView({ scene }: { scene: SceneModule }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewpoint, setViewpoint] = useState<Viewpoint | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [mode, setMode] = useState<Mode>("explore");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [lastOutcome, setLastOutcome] = useState<ChallengeOutcome | null>(null);
  const [learning, setLearning] = useState(loadLearning);
  const [challengeSelection, setChallengeSelection] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((SCENE_TOGGLES[scene.id] ?? []).map((t) => [t.key, true])),
  );
  const [key, setKey] = useState(0);

  const controller = useSceneController(scene);
  const options = useMemo(
    () => ({ ...userOptions, ...controller.options }),
    [userOptions, controller.options],
  );

  const hotspot = useMemo(
    () => scene.hotspots.find((h) => h.id === activeId) ?? null,
    [scene, activeId],
  );
  const onViewpoint = useCallback((v: Viewpoint) => setViewpoint(v), []);
  const sceneChallenges = useMemo(() => challengesForScene(scene.id), [scene.id]);
  const misconceptions = useMemo(
    () =>
      inferLearningSignals(learning.mastery, learning.attempts).map((signal) => signal.message),
    [learning.mastery, learning.attempts],
  );
  const masterySummary = useMemo(
    () => ({
      categories: learning.mastery.categories,
      concepts: learning.mastery.concepts,
      updatedAt: learning.mastery.updatedAt,
    }),
    [learning.mastery],
  );

  // Heart flagship demo hook: the canonical judge question stages a compare view.
  // The local staging and the validated server actions converge on the same
  // visual state; whichever lands first wins, the second is idempotent.
  const stageCompareDemo = useCallback(() => {
    controller.dispatch([
      { type: "fadeOthers", hotspotIds: ["left-ventricle", "right-ventricle"] },
      { type: "focus", hotspotId: "left-ventricle" },
    ]);
    // Selecting the structure keeps the tutor grounded on the same target.
    setActiveId("left-ventricle");
  }, [controller]);

  const onSelect = useCallback(
    (id: string) => {
      const next = id === "" ? null : id;
      // Challenge mode consumes 3D clicks as answers; free explore selects for the tutor.
      if (mode === "challenge" && next) {
        setChallengeSelection(next);
        return;
      }
      setActiveId(next);
      if (next) {
        setLearning((state) => addLearningEvent(state, { type: "hotspot_selected", sceneId: scene.id, hotspotId: next, timestamp: new Date().toISOString() }));
      }
      // Selecting in explore clears emphasis so the scene reads clean again.
      if (next === null) controller.dispatch({ type: "resetScene" });
    },
    [mode, controller, scene.id],
  );

  const onSceneActions = useCallback((actions: SceneAction[]) => {
    controller.dispatch(actions);
    for (const action of actions) {
      if (action.type === "resetScene") {
        setKey((value) => value + 1);
        setActiveId(null);
      }
    }
    setLearning((state) => actions.reduce((next, action) => addLearningEvent(next, { type: "scene_action_executed", sceneId: scene.id, actionType: action.type, timestamp: new Date().toISOString() }), state));
  }, [controller, scene.id]);

  const startChallenge = useCallback(
    (c: Challenge) => {
      setChallenge(c);
      setLastOutcome(null);
      setChallengeSelection(null);
      setMode("challenge");
      // Open with a clean slate, then let ChallengeBar stage each step.
      controller.dispatch({ type: "resetScene" });
      setLearning((state) => addLearningEvent(state, { type: "challenge_started", sceneId: c.sceneId, challengeId: c.id, timestamp: new Date().toISOString() }));
    },
    [controller],
  );

  const startFirstChallenge = useCallback(() => {
    const first = sceneChallenges[0];
    if (first) startChallenge(first);
  }, [sceneChallenges, startChallenge]);

  const practiceAgain = useCallback(() => {
    setLastOutcome(null);
    const first = sceneChallenges[0];
    if (first) startChallenge(first);
    else setMode("explore");
  }, [sceneChallenges, startChallenge]);

  const onPickIndex = useCallback(
    (id: string) => {
      if (mode === "challenge") {
        setChallengeSelection(id);
      } else {
        setActiveId(id);
        controller.dispatch({ type: "focus", hotspotId: id });
      }
    },
    [mode, controller],
  );

  const onPickIndexAndClose = useCallback(
    (id: string) => {
      setDrawer(false);
      onPickIndex(id);
    },
    [onPickIndex],
  );

  const onStartChallengeAndClose = useCallback(
    (c: Challenge) => {
      setDrawer(false);
      startChallenge(c);
    },
    [startChallenge],
  );

  const onToggleOption = useCallback(
    (k: string, v: boolean) => setUserOptions((o) => ({ ...o, [k]: v })),
    [],
  );

  const exitChallenge = useCallback(() => {
    setChallenge(null);
    setChallengeSelection(null);
    setMode("explore");
    controller.dispatch({ type: "resetScene" });
  }, [controller]);

  const completeChallenge = useCallback(
    (outcome: ChallengeOutcome) => {
      setLearning((state) => recordChallengeResult(state, outcome.attempt, outcome.challenge));
      setLastOutcome(outcome);
      setMode("mastery");
      controller.dispatch({ type: "resetScene" });
    },
    [controller],
  );

  const reviewWeakArea = useCallback(
    (recommended: Challenge) => {
      startChallenge(recommended);
    },
    [startChallenge],
  );

  // Reset controller whenever the scene changes.
  useEffect(() => {
    controller.reset();
    setActiveId(null);
    setChallenge(null);
    setLastOutcome(null);
    setChallengeSelection(null);
    setMode("explore");
    setLearning((state) => addLearningEvent(state, { type: "scene_opened", sceneId: scene.id, timestamp: new Date().toISOString() }));
    setUserOptions(Object.fromEntries((SCENE_TOGGLES[scene.id] ?? []).map((t) => [t.key, true])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  // Mobile: structure index + challenges live in a drawer (aside is lg+ only).
  // Hook order must stay stable: declare before any early return.
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setDrawer(false), [scene.id]);

  const narration = controller.state.narration;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0a0a0a] text-[#eaeaea] lg:h-screen lg:overflow-hidden">
      <header className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-4 border-b-2 border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 md:grid-cols-[auto_auto_1fr_auto] md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            className="ui-interactive inline-flex shrink-0 cursor-pointer items-center gap-2 font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase hover:text-[#ffffff]"
            aria-label="Back to module library"
          >
            <IconBack className="h-4 w-4" />
            <span className="hidden sm:inline">[ LIB ]</span>
          </Link>
          <div className="hidden h-6 w-px shrink-0 bg-[#2a2a2a] md:block" aria-hidden />
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-black uppercase">{scene.title}</h1>
            <p className="truncate font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">
              {scene.subject} Level {scene.level}
            </p>
          </div>
        </div>
        {/* EXPLORE / ASK / CHALLENGE / MASTER: one workflow, not four pages. */}
        <nav
          aria-label="Learning modes"
          className="col-span-2 flex shrink-0 items-center gap-1 md:order-none md:col-span-1 md:w-auto"
        >
          <ModeTabs
            mode={mode}
            onExplore={exitChallenge}
            onChallenge={startFirstChallenge}
            onMaster={() => setMode("mastery")}
            hasChallenge={sceneChallenges.length > 0}
          />
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            onClick={() => setDrawer((d) => !d)}
            aria-expanded={drawer}
            aria-label={drawer ? "Close structures panel" : "Open structures and challenges panel"}
            className={`ui-interactive inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center gap-1.5 border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-xs text-[#eaeaea] hover:text-[#ffffff] lg:hidden ${
              drawer ? "font-bold text-[#eaeaea]" : ""
            }`}
            
          >
            <IconLayers className="h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">STRUCTURES</span>
          </button>
          <button
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
            title="Slowly orbit the camera"
            className={`ui-interactive inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-xs text-[#eaeaea] hover:text-[#ffffff] ${
              autoRotate ? "font-bold text-[#eaeaea]" : ""
            }`}
            
          >
            <IconOrbit className="h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">ORBIT</span>
          </button>
          <button
            onClick={() => {
              setKey((k) => k + 1);
              setActiveId(null);
              controller.dispatch({ type: "resetScene" });
            }}
            title="Restore the default camera and visibility"
            className="ui-interactive inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-xs text-[#eaeaea] hover:text-[#ffffff]"
            
          >
            <IconReset className="h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </header>

      <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[264px_minmax(0,1fr)_360px] lg:gap-6 lg:overflow-hidden">
        {/* Structure index */}
        <aside
          aria-label="Structure index and challenges"
          className="order-2 hidden min-h-0 flex-col overflow-hidden border border-[#2a2a2a] bg-[#111111] lg:order-1 lg:flex"
          
        >
          <IndexPanel
            scene={scene}
            activeId={activeId}
            mode={mode}
            options={options}
            sceneChallenges={sceneChallenges}
            onPick={onPickIndex}
            onToggleOption={onToggleOption}
            onStartChallenge={startChallenge}
          />
        </aside>

        {/* Viewport */}
        <section
          aria-label={`${scene.title} 3D viewport`}
          className="relative order-1 min-h-[52vh] overflow-hidden border border-[#2a2a2a] bg-[#0a0a0a] sm:min-h-[48vh] lg:order-2 lg:min-h-0"
          
        >
          <SceneCanvas
            key={key}
            scene={scene}
            activeHotspot={activeId}
            onSelectHotspot={onSelect}
            onViewpoint={onViewpoint}
            options={options}
            autoRotate={autoRotate}
            focus={controller.state.focus}
            emphasis={controller.state.emphasis}
            labels={controller.state.labels}
            emphasizeModels={MODEL_EMPHASIS_SCENES.has(scene.id)}
          />
          <div className="pointer-events-none absolute left-4 top-4 max-w-xs border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#e61919] uppercase">
              [ {scene.accentLabel} ]
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">{scene.tagline}</p>
          </div>
           {mode === "challenge" && challenge ? (
            <ChallengeBar
              challenge={challenge}
              selection={challengeSelection}
              onConsumeSelection={() => setChallengeSelection(null)}
              onEmphasize={(ids) => controller.dispatch({ type: "highlight", hotspotIds: ids })}
              onReveal={(ids) => controller.dispatch({ type: "highlight", hotspotIds: ids })}
              onFocusStep={(ids) =>
                controller.dispatch([
                  { type: "fadeOthers", hotspotIds: ids },
                  ...(ids[0] ? [{ type: "focus" as const, hotspotId: ids[0] }] : []),
                ])
              }
              onExit={exitChallenge}
              onComplete={completeChallenge}
            />
           ) : null}
           {narration ? (
            <p
              key={narration}
              role="status"
              aria-live="polite"
              className="animate-fade-swap pointer-events-none absolute left-4 top-24 max-w-md border border-[#e61919] bg-[#0a0a0a] px-3 py-1.5 font-mono text-xs tracking-[0.05em] text-[#eaeaea] uppercase"
              
            >
              {narration}
            </p>
           ) : null}
            {hotspot && mode !== "challenge" ? (
            <div
              key={hotspot.id}
              className="animate-fade-swap pointer-events-none absolute bottom-4 left-4 right-4 max-w-md border border-[#2a2a2a] bg-[#0a0a0a] p-4"
              
            >
              <p className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#e61919] uppercase">
                [ {hotspot.category} ]
              </p>
              <p className="mt-1 font-display text-sm font-black uppercase">{hotspot.name}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#eaeaea]">
                {hotspot.summary}
              </p>
              <p className="mt-1.5 hidden text-[11px] text-[#9a9a9a] md:block">
                {hotspot.facts[0]}
              </p>
            </div>
           ) : mode !== "challenge" ? (
            <p className="pointer-events-none absolute bottom-4 left-4 border border-[#2a2a2a] bg-[#0a0a0a] px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase"
              >
              DRAG: ORBIT /// SCROLL: ZOOM /// CLICK MARKER: QUERY TUTOR
            </p>
          ) : null}
        </section>

        {/* Tutor / mastery */}
        <aside
          aria-label="Tutor and mastery"
          className="order-3 min-h-[42vh] space-y-3 lg:min-h-0 lg:overflow-y-auto lg:pr-0.5"
        >
          <TutorPanel
            scene={scene}
            hotspot={hotspot}
            viewpoint={viewpoint}
            onSceneActions={onSceneActions}
            onStageCompare={scene.id === "cardiac" ? stageCompareDemo : undefined}
            onStartChallenge={
              sceneChallenges[0]
                ? (candidate) => startChallenge(candidate ?? sceneChallenges[0]!)
                : undefined
            }
            masterySummary={masterySummary}
            recentChallengeAttempts={learning.attempts}
            recentMisconceptions={misconceptions}
          />
          {mode === "mastery" || lastOutcome ? (
            <MasteryPanel
              scene={scene}
              profile={learning.mastery}
              onReviewWeakArea={reviewWeakArea}
              onPracticeAgain={practiceAgain}
            />
          ) : null}
        </aside>
      </div>

      {/* Mobile drawer: same index content, rendered only below lg. */}
      {drawer ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-label="Structures and challenges"
        >
          <button
            aria-label="Close structures panel"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-[#111111]/70"
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto border-t border-[#2a2a2a] bg-[#111111] p-2"
            
          >
            <IndexPanel
              scene={scene}
              activeId={activeId}
              mode={mode}
              options={options}
              sceneChallenges={sceneChallenges}
              onPick={onPickIndexAndClose}
              onToggleOption={onToggleOption}
              onStartChallenge={onStartChallengeAndClose}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function IndexPanel({
  scene,
  activeId,
  mode,
  options,
  sceneChallenges,
  onPick,
  onToggleOption,
  onStartChallenge,
}: {
  scene: SceneModule;
  activeId: string | null;
  mode: Mode;
  options: Record<string, boolean>;
  sceneChallenges: Challenge[];
  onPick: (id: string) => void;
  onToggleOption: (key: string, value: boolean) => void;
  onStartChallenge: (c: Challenge) => void;
}) {
  return (
    <>
      <h2 className="flex items-center gap-2 px-6 pt-6 pb-2 font-mono text-xs font-bold tracking-[0.1em]">
        <IconLayers className="h-4 w-4 text-[#e61919]" />
        STRUCTURES
      </h2>
      <ul className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {scene.hotspots.map((h, i) => {
          const selected = activeId === h.id && mode !== "challenge";
          return (
            <li key={h.id}>
              <button
                onClick={() => onPick(h.id)}
                aria-current={selected ? "true" : undefined}
                title={`${h.name}, ${h.category}. ${mode === "challenge" ? "Submit as challenge answer" : "Focus and ask the tutor"}`}
                className={`ui-interactive w-full cursor-pointer border-l-2 px-3 py-2 text-left ${
                  selected
                    ? "border-[#e61919] font-bold text-[#eaeaea]"
                    : "border-transparent text-[#9a9a9a] hover:text-[#eaeaea]"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[#9a9a9a] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{h.name}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-[#2a2a2a] px-6 py-6">
        <h2 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.1em]">
          <IconSwords className="h-4 w-4 text-[#e61919]" />
          CHALLENGES
        </h2>
        {sceneChallenges.length === 0 ? (
          <p className="font-mono text-xs tracking-[0.1em] text-[#9a9a9a]">
            NO CHALLENGES AUTHORED FOR THIS SCENE.
          </p>
        ) : (
          <ul className="space-y-2">
            {sceneChallenges.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onStartChallenge(c)}
                  title={`Start challenge: ${c.prompt}`}
                  className="ui-interactive w-full cursor-pointer border border-[#2a2a2a] bg-[#111111] px-3 py-2.5 text-left hover:border-[#e61919]"
                  
                >
                  <span className="line-clamp-2 text-sm leading-relaxed text-[#eaeaea]">{c.prompt}</span>
                  <span className="mt-1.5 inline-block bg-[#e61919] px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.05em] text-white">
                    LVL {c.difficulty}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(SCENE_TOGGLES[scene.id] ?? []).length > 0 ? (
        <div className="border-t border-[#2a2a2a] px-6 py-6">
          <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a9a9a]">
            RENDER OPTS
          </h2>
          {(SCENE_TOGGLES[scene.id] ?? []).map((t) => (
            <label
              key={t.key}
              className="ui-interactive mb-1 flex cursor-pointer items-center gap-2 px-1 py-0.5 font-mono text-xs text-[#9a9a9a] uppercase hover:text-[#eaeaea]"
            >
              <input
                type="checkbox"
                checked={options[t.key] ?? false}
                onChange={(e) => onToggleOption(t.key, e.target.checked)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[var(--primary)]"
              />
              {t.label}
            </label>
          ))}
        </div>
      ) : null}
    </>
  );
}

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "explore", label: "EXPLORE", hint: "Explore the 3D model and ask the tutor" },
  { id: "challenge", label: "CHALLENGE", hint: "Test yourself by selecting structures in 3D" },
  { id: "mastery", label: "MASTER", hint: "Review your mastery and weakest area" },
];

const ModeTabs = memo(function ModeTabs({
  mode,
  onExplore,
  onChallenge,
  onMaster,
  hasChallenge,
}: {
  mode: Mode;
  onExplore: () => void;
  onChallenge: () => void;
  onMaster: () => void;
  hasChallenge: boolean;
}) {
  return (
    <div role="group" aria-label="Learning modes" className="flex items-center gap-5">
      {MODES.map((m) => {
        const active = mode === m.id;
        const disabled = m.id === "challenge" && !hasChallenge;
        return (
          <button
            key={m.id}
            onClick={m.id === "explore" ? onExplore : m.id === "challenge" ? onChallenge : onMaster}
            disabled={disabled}
            aria-current={active ? "page" : undefined}
            title={m.hint}
            className={`ui-interactive border-b-2 px-0.5 py-1.5 font-mono text-xs tracking-[0.1em] ${
              active
                ? "border-[#e61919] font-bold text-[#eaeaea]"
                : "border-transparent text-[#9a9a9a] hover:text-[#ffffff]"
            } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
});
