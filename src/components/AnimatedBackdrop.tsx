/** Static warm wash (minimalist-ui: no ambient motion, no gradients). */
export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#F7F6F3]" />
      <div
        className="absolute rounded-none"
        style={{
          top: "-12rem",
          left: "-8rem",
          height: "34rem",
          width: "34rem",
          background: "#EAEAEA",
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
          background: "#EAEAEA",
          opacity: 0.4,
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
