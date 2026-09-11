import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

import type { Hotspot } from "@/lib/scenes";

type Props = {
  hotspot: Hotspot;
  active: boolean;
  index: number;
  dimmed?: boolean;
  showLabel?: boolean;
  onSelect: (id: string) => void;
};

export function Hotspot3D({
  hotspot,
  active,
  index,
  dimmed = false,
  showLabel = true,
  onSelect,
}: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = active ? 1.25 + Math.sin(t * 3) * 0.08 : hovered ? 1.15 : 1;
    ref.current.scale.setScalar(s);
  });

  return (
    <group position={hotspot.position}>
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshBasicMaterial
            color={active ? "#6ee7b7" : "#10b981"}
            toneMapped={false}
            transparent={dimmed && !active}
            opacity={dimmed && !active ? 0.35 : 1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshBasicMaterial
            color={active ? "#6ee7b7" : "#10b981"}
            transparent
            opacity={hovered || active ? 0.32 : 0.14}
            toneMapped={false}
          />
        </mesh>
      </group>

      {showLabel ? (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap border px-3 py-1 text-[11px] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              active
                ? "border-emerald-300/60 bg-emerald-400 font-semibold text-emerald-950 opacity-100"
                : hovered
                  ? "border-white/20 bg-black/70 font-medium text-white opacity-100"
                  : "border-white/10 bg-black/60 text-zinc-300 opacity-95"
            }`}
            style={{ transform: "translateY(-2.2rem)", borderRadius: 9999 }}
          >
            <span className="mr-1.5 font-mono text-[10px] text-current tabular-nums opacity-70">
              {String(index + 1).padStart(2, "0")}
            </span>
            {hotspot.name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
