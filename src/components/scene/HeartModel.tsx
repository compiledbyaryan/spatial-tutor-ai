import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Procedural, anatomically-schematic cardiac model.
 * Chambers are deformed spheres, great vessels are tubes along Catmull-Rom curves.
 *
 * Groups that correspond to a hotspot are named `hotspot:<id>` so the scene
 * controller can dim / hide model parts (isolate, fadeOthers). Groups without
 * a hotspot name are shared scaffolding (vessels, valves) and never hidden.
 */
function vesselCurve(points: [number, number, number][]) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
}

const aorta = vesselCurve([
  [-1.0, -0.2, 0.4],
  [-0.7, 1.0, 0.1],
  [-0.35, 2.2, -0.1],
  [0.35, 2.9, -0.5],
  [1.1, 2.3, -1.0],
  [1.25, 1.0, -1.2],
]);

const pulmonary = vesselCurve([
  [0.9, 0.1, 0.6],
  [0.85, 1.2, 0.6],
  [0.75, 2.1, 0.45],
  [0.1, 2.6, 0.3],
  [-0.9, 2.5, 0.2],
]);

const venaCava = vesselCurve([
  [1.5, 2.4, -0.3],
  [1.35, 1.4, -0.3],
  [1.2, 0.6, -0.3],
  [1.3, -1.4, -0.4],
]);

const coronary = vesselCurve([
  [-0.6, 1.0, 1.0],
  [-1.2, 0.4, 1.1],
  [-1.5, -0.4, 0.9],
  [-1.2, -1.3, 0.6],
]);

export function HeartModel({ pulse }: { pulse: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    if (!pulse) {
      group.current.scale.setScalar(1);
      return;
    }
    const t = state.clock.elapsedTime * 1.35;
    const beat =
      Math.pow(Math.max(0, Math.sin(t)), 6) * 0.05 +
      Math.pow(Math.max(0, Math.sin(t - 0.5)), 8) * 0.03;
    group.current.scale.setScalar(1 + beat);
  });

  const myocardium = (
    <meshPhysicalMaterial
      color="#a33141"
      roughness={0.42}
      clearcoat={0.6}
      clearcoatRoughness={0.35}
      sheen={0.5}
      sheenColor="#ff8a97"
    />
  );

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Left ventricle — thick-walled cone-sphere */}
      <group name="hotspot:left-ventricle">
        <mesh position={[-0.95, -0.7, 0.4]} rotation={[0.15, 0, 0.22]} castShadow receiveShadow>
          <sphereGeometry args={[1.15, 48, 48]} />
          {myocardium}
        </mesh>
        <mesh position={[-0.95, -1.6, 0.35]} rotation={[0.1, 0, 0.18]} castShadow>
          <coneGeometry args={[0.85, 1.5, 40]} />
          {myocardium}
        </mesh>
      </group>

      {/* Right ventricle — thinner, crescent-like */}
      <group name="hotspot:right-ventricle">
        <mesh
          position={[0.75, -0.65, 0.55]}
          rotation={[0.1, 0, -0.18]}
          scale={[0.92, 1, 0.8]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1.0, 48, 48]} />
          <meshPhysicalMaterial
            color="#8d5a86"
            roughness={0.5}
            clearcoat={0.4}
            sheen={0.4}
            sheenColor="#c99ac6"
          />
        </mesh>
      </group>

      {/* Atria */}
      <group name="hotspot:left-atrium">
        <mesh position={[-0.9, 0.95, -0.3]} scale={[0.85, 0.72, 0.85]} castShadow>
          <sphereGeometry args={[0.85, 40, 40]} />
          <meshPhysicalMaterial color="#b8515f" roughness={0.55} sheen={0.3} />
        </mesh>
      </group>
      <group name="hotspot:right-atrium">
        <mesh position={[1.0, 0.95, -0.25]} scale={[0.82, 0.7, 0.82]} castShadow>
          <sphereGeometry args={[0.85, 40, 40]} />
          <meshPhysicalMaterial color="#7d5f96" roughness={0.55} sheen={0.3} />
        </mesh>
      </group>

      {/* Interventricular groove */}
      <mesh position={[-0.1, -0.7, 0.95]} rotation={[0, 0, 0.08]}>
        <capsuleGeometry args={[0.09, 1.7, 8, 16]} />
        <meshStandardMaterial color="#ffd9a0" roughness={0.7} />
      </mesh>

      {/* Great vessels */}
      <group name="hotspot:aorta">
        <mesh castShadow>
          <tubeGeometry args={[aorta, 96, 0.3, 24, false]} />
          <meshPhysicalMaterial color="#d9c7bd" roughness={0.35} clearcoat={0.5} />
        </mesh>
      </group>
      <group name="hotspot:pulmonary-artery">
        <mesh castShadow>
          <tubeGeometry args={[pulmonary, 96, 0.26, 24, false]} />
          <meshPhysicalMaterial color="#6f8fbf" roughness={0.35} clearcoat={0.5} />
        </mesh>
      </group>
      <mesh castShadow>
        <tubeGeometry args={[venaCava, 96, 0.24, 20, false]} />
        <meshPhysicalMaterial color="#5c7bb0" roughness={0.4} />
      </mesh>
      <group name="hotspot:coronary">
        <mesh>
          <tubeGeometry args={[coronary, 80, 0.075, 14, false]} />
          <meshStandardMaterial color="#e8b455" roughness={0.4} emissive="#5a3a00" />
        </mesh>
      </group>

      {/* Valve annuli */}
      <group name="hotspot:mitral-valve">
        <mesh position={[-0.9, 0.2, 0.6]} rotation={[Math.PI / 2.2, 0, 0.2]}>
          <torusGeometry args={[0.42, 0.07, 16, 40]} />
          <meshStandardMaterial color="#f0e6d2" roughness={0.3} />
        </mesh>
      </group>
      <group name="hotspot:aortic-valve">
        <mesh position={[-1.0, -0.15, 0.5]} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.3, 0.065, 16, 40]} />
          <meshStandardMaterial color="#fff0cf" roughness={0.28} />
        </mesh>
      </group>
      <mesh position={[0.85, 0.22, 0.75]} rotation={[Math.PI / 2.2, 0, -0.2]}>
        <torusGeometry args={[0.4, 0.06, 16, 40]} />
        <meshStandardMaterial color="#e4dcc9" roughness={0.35} />
      </mesh>
    </group>
  );
}
