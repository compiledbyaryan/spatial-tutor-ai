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
            color={active ? "#ffc561" : "#7fe6ef"}
            toneMapped={false}
            transparent={dimmed && !active}
            opacity={dimmed && !active ? 0.35 : 1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshBasicMaterial
            color={active ? "#ffc561" : "#7fe6ef"}
            transparent
            opacity={hovered || active ? 0.28 : 0.12}
            toneMapped={false}
          />
        </mesh>
      </group>

      {showLabel ? (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap border px-2 py-1 text-[11px] transition-opacity ${
              active
                ? "border-[#111111] bg-[#111111] font-semibold text-white opacity-100"
                : hovered
                  ? "border-[#111111] bg-white font-medium text-[#111111] opacity-100"
                  : "border-[#EAEAEA] bg-white/95 text-[#2F3437] opacity-95"
            }`}
            style={{ transform: "translateY(-2.2rem)", borderRadius: 6 }}
          >
            <span className="mr-1.5 font-mono text-[10px] text-[#787774] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {hotspot.name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
