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
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase transition-opacity ${
              active
                ? "border-accent/60 bg-accent/15 text-accent opacity-100"
                : hovered
                  ? "border-primary/60 bg-background/80 text-primary opacity-100"
                  : "border-border/60 bg-background/60 text-muted-foreground opacity-70"
            }`}
            style={{ transform: "translateY(-2.2rem)" }}
          >
            {String(index + 1).padStart(2, "0")} · {hotspot.name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
