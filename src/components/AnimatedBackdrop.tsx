/** Soft static wash for the light learning theme. No continuous motion. */
export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-backdrop absolute inset-0 opacity-60" />
      <div
        className="absolute rounded-full"
        style={{
          top: "-12rem",
          left: "-8rem",
          height: "34rem",
          width: "34rem",
          background: "var(--gradient-instrument)",
          opacity: 0.12,
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "18%",
          right: "-10rem",
          height: "30rem",
          width: "30rem",
          background: "var(--gradient-focus)",
          opacity: 0.1,
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
