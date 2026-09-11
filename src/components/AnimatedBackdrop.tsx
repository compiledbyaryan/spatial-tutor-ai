/** Static zinc wash (design-taste-frontend: calm page, motion stays in reveals). */
export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#fafafa]" />
      <div
        className="absolute rounded-none"
        style={{
          top: "-12rem",
          left: "-8rem",
          height: "34rem",
          width: "34rem",
          background: "#e4e4e7",
          opacity: 0.5,
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute rounded-none"
        style={{
          top: "18%",
          right: "-10rem",
          height: "30rem",
          width: "30rem",
          background: "#e4e4e7",
          opacity: 0.4,
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
