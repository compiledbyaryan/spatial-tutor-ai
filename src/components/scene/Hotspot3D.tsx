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
            color={active ? "#e61919" : "#eaeaea"}
            toneMapped={false}
            transparent={dimmed && !active}
            opacity={dimmed && !active ? 0.35 : 1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 20, 20]} />
          <meshBasicMaterial
            color={active ? "#e61919" : "#eaeaea"}
            transparent
            opacity={hovered || active ? 0.28 : 0.12}
            toneMapped={false}
          />
        </mesh>
      </group>

      {showLabel ? (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap border px-2 py-1 font-mono text-[11px] tracking-[0.05em] uppercase ${
              active
                ? "border-[#e61919] bg-[#e61919] font-bold text-white opacity-100"
                : hovered
                  ? "border-[#eaeaea] bg-[#0a0a0a] font-bold text-[#eaeaea] opacity-100"
                  : "border-[#2a2a2a] bg-[#111111]/95 text-[#eaeaea] opacity-95"
            }`}
            style={{ transform: "translateY(-2.2rem)" }}
          >
            <span className="mr-1.5 font-mono text-[10px] text-[#9a9a9a] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {hotspot.name.toUpperCase()}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
