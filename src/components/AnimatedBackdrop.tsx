/* CRT shell: scanlines plus mechanical noise, fixed and pointer-transparent. */
export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgb(0 0 0 / 0.18) 2px, rgb(0 0 0 / 0.18) 4px)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]">
        <filter id="spatia-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#spatia-noise)" />
      </svg>
    </div>
  );
}
