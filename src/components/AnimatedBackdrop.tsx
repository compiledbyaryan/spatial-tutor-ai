/* Ethereal Glass backdrop: OLED black, emerald and teal mesh orbs, film grain. */
export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute rounded-full"
        style={{
          top: "-14rem",
          left: "-10rem",
          height: "38rem",
          width: "38rem",
          background: "radial-gradient(circle, rgb(16 185 129 / 0.22), transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "24%",
          right: "-12rem",
          height: "34rem",
          width: "34rem",
          background: "radial-gradient(circle, rgb(45 212 191 / 0.14), transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-16rem",
          left: "30%",
          height: "30rem",
          width: "30rem",
          background: "radial-gradient(circle, rgb(16 185 129 / 0.1), transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]">
        <filter id="spatia-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#spatia-grain)" />
      </svg>
    </div>
  );
}
