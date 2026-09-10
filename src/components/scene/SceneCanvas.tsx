import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { Emphasis, FocusRequest } from "@/hooks/useSceneController";

import { CathedralModel } from "./CathedralModel";
import { BinaryTreeModel, DnaModel, LatticeModel, WaveModel } from "./ConceptModels";
import { HeartModel } from "./HeartModel";
import { Hotspot3D } from "./Hotspot3D";
import { MoleculeModel } from "./MoleculeModel";
import { GearboxModel, SolarSystemModel, TectonicModel } from "./ScienceModels";
import type { SceneModule } from "@/lib/scenes";

export type Viewpoint = {
  position: [number, number, number];
  distance: number;
  azimuth: number;
  polar: number;
};

function ViewpointTracker({ onChange }: { onChange: (v: Viewpoint) => void }) {
  const camera = useThree((s) => s.camera);
  const last = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const p = camera.position;
      const distance = p.length();
      const azimuth = Math.atan2(p.x, p.z);
      const polar = Math.acos(Math.min(1, Math.max(-1, p.y / (distance || 1))));
      const stamp = Math.round(distance * 10) + Math.round(azimuth * 20) * 1000;
      if (stamp === last.current) return;
      last.current = stamp;
      onChange({
        position: [+p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2)],
        distance: +distance.toFixed(2),
        azimuth,
        polar,
      });
    }, 320);
    return () => clearInterval(id);
  }, [camera, onChange]);

  return null;
}

/**
 * Smoothly flies the camera toward the requested hotspot, then releases
 * control back to OrbitControls. Invalid requests never arrive here —
 * the controller filters them — but a missing target still degrades to
 * "do nothing" rather than a snap.
 */
function FocusRig({
  focus,
  target,
}: {
  focus: FocusRequest | null;
  target: [number, number, number];
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as {
    target: THREE.Vector3;
    update: () => void;
  } | null;
  const anim = useRef<{ from: THREE.Vector3; to: THREE.Vector3; t: number } | null>(null);
  const lastNonce = useRef(0);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!focus || focus.nonce === lastNonce.current) return;
    lastNonce.current = focus.nonce;
    const dest = new THREE.Vector3(...focus.position);
    const dir = dest.clone().sub(new THREE.Vector3(...target));
    if (dir.lengthSq() < 0.01) dir.set(0.5, 0.35, 1);
    dir.normalize();
    const to = dest.clone().add(dir.multiplyScalar(5.2));
    to.y = Math.max(to.y, dest.y + 1.1);
    if (reduced) {
      camera.position.copy(to);
      controls?.target.copy(dest);
      controls?.update();
      return;
    }
    anim.current = { from: camera.position.clone(), to, t: 0 };
  }, [focus, camera, controls, target, reduced]);

  useFrame((_, delta) => {
    const a = anim.current;
    if (!a) return;
    a.t = Math.min(1, a.t + delta / 0.9);
    const e = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.from, a.to, e);
    if (controls) {
      controls.target.lerp(new THREE.Vector3(...target), e * 0.4);
      controls.update();
    }
    if (a.t >= 1) anim.current = null;
  });

  return null;
}

/** Walks model groups named `hotspot:<id>` and dims / hides them per emphasis. */
function EmphasisRig({
  emphasis,
  enabled,
}: {
  emphasis: Record<string, Emphasis>;
  enabled: boolean;
}) {
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    if (!enabled) return;
    const restore: (() => void)[] = [];
    scene.traverse((obj) => {
      if (!obj.name.startsWith("hotspot:")) return;
      const id = obj.name.slice("hotspot:".length);
      const state = emphasis[id] ?? "normal";
      if (state === "normal" || state === "highlight") return;
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
        if (!mat) return;
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const m of mats) {
          const prev = { transparent: m.transparent, opacity: m.opacity, visible: mesh.visible };
          if (state === "dimmed") {
            m.transparent = true;
            m.opacity = Math.min(m.opacity, 0.12);
          } else {
            mesh.visible = false;
          }
          restore.push(() => {
            m.transparent = prev.transparent;
            m.opacity = prev.opacity;
            mesh.visible = prev.visible;
          });
        }
      });
    });
    return () => {
      for (const fn of restore) fn();
    };
  }, [scene, emphasis, enabled]);

  return null;
}

function labelVisible(
  id: string,
  labels: { mode: "all" } | { mode: "none" } | { mode: "only"; ids: string[] },
): boolean {
  if (labels.mode === "none") return false;
  if (labels.mode === "only") return labels.ids.includes(id);
  return true;
}

function SceneBody({ scene, options }: { scene: SceneModule; options: Record<string, boolean> }) {
  if (scene.id === "cardiac") return <HeartModel pulse={options["pulse"] ?? true} />;
  if (scene.id === "caffeine")
    return (
      <MoleculeModel showHydrogens={options["hydrogens"] ?? options["showHydrogens"] ?? true} />
    );
  if (scene.id === "cathedral")
    return <CathedralModel showVault={options["vault"] ?? options["showVault"] ?? true} />;
  if (scene.id === "solar-system") return <SolarSystemModel />;
  if (scene.id === "tectonics") return <TectonicModel />;
  if (scene.id === "binary-tree") return <BinaryTreeModel />;
  if (scene.id === "dna") return <DnaModel unwind={options["unwind"] ?? false} />;
  if (scene.id === "wave-interference")
    return <WaveModel twoSources={options["twoSources"] ?? true} />;
  if (scene.id === "lattice")
    return <LatticeModel showBonds={options["bonds"] ?? options["showBonds"] ?? true} />;
  return <GearboxModel />;
}

type Props = {
  scene: SceneModule;
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
  onViewpoint: (v: Viewpoint) => void;
  options: Record<string, boolean>;
  autoRotate: boolean;
  focus?: FocusRequest | null;
  emphasis?: Record<string, Emphasis>;
  labels?: { mode: "all" } | { mode: "none" } | { mode: "only"; ids: string[] };
  emphasizeModels?: boolean;
};

export function SceneCanvas({
  scene,
  activeHotspot,
  onSelectHotspot,
  onViewpoint,
  options,
  autoRotate,
  focus = null,
  emphasis,
  labels = { mode: "all" },
  emphasizeModels = false,
}: Props) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const effectiveEmphasis = useMemo<Record<string, Emphasis>>(
    () => emphasis ?? Object.fromEntries(scene.hotspots.map((h) => [h.id, "normal" as Emphasis])),
    [emphasis, scene],
  );

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: scene.camera.position, fov: 45 }}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelectHotspot("")}
    >
      <color attach="background" args={["#17191d"]} />
      <fog attach="fog" args={["#17191d", 26, 70]} />

      <hemisphereLight args={["#bcd7ff", "#2a2f3d", 0.55]} />
      <directionalLight
        position={[8, 14, 8]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-9, 5, -6]} intensity={0.6} color="#8fd8ff" />
      <pointLight position={[0, 3, 6]} intensity={18} distance={22} color="#ffd8a8" />

      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer intensity={2.4} position={[0, 6, 0]} scale={[12, 12, 1]} />
          <Lightformer
            intensity={1.1}
            color="#8fc4ff"
            position={[-6, 2, -2]}
            rotation-y={Math.PI / 2}
            scale={[20, 2, 1]}
          />
          <Lightformer
            intensity={0.9}
            color="#ffc07a"
            position={[6, 1, 2]}
            rotation-y={-Math.PI / 2}
            scale={[20, 2, 1]}
          />
        </Environment>

        <SceneBody scene={scene} options={options} />

        {scene.hotspots.map((h, i) => {
          const state = effectiveEmphasis[h.id] ?? "normal";
          if (state === "hidden") return null;
          return (
            <Hotspot3D
              key={h.id}
              hotspot={h}
              index={i}
              active={activeHotspot === h.id}
              dimmed={state === "dimmed"}
              showLabel={labelVisible(h.id, labels)}
              onSelect={onSelectHotspot}
            />
          );
        })}
      </Suspense>

      <EmphasisRig emphasis={effectiveEmphasis} enabled={emphasizeModels} />
      <FocusRig focus={focus} target={scene.camera.target} />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={30}
        target={scene.camera.target}
        autoRotate={autoRotate}
        autoRotateSpeed={0.55}
      />
      <ViewpointTracker onChange={onViewpoint} />
    </Canvas>
  );
}
