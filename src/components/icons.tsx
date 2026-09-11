type IconProps = { className?: string | undefined };

function Base({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Bold-stroke icon set (minimalist-ui protocol: no Lucide/Feather/Heroicons). */
export function IconBack({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </Base>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </Base>
  );
}

export function IconOrbit({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="3.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-20 12 12)" />
    </Base>
  );
}

export function IconReset({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </Base>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 3v5" />
      <path d="M12 16v5" />
      <path d="M3 12h5" />
      <path d="M16 12h5" />
      <path d="M6 6l3 3" />
      <path d="M15 15l3 3" />
      <path d="M18 6l-3 3" />
      <path d="M9 15l-3 3" />
    </Base>
  );
}

export function IconSend({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4 18-7z" />
    </Base>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </Base>
  );
}

export function IconSwords({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 20l3-3" />
      <path d="M7 17L17 7l3 3L10 20H7v-3z" />
      <path d="M14 4l6 6" />
      <path d="M20 4l-3 3" />
    </Base>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Base>
  );
}

export function IconCross({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </Base>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Base>
  );
}

export function IconBulb({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.8.6 1.5 1.4 1.5 2.1h4c0-.7.7-1.5 1.5-2.1A6 6 0 0 0 12 3z" />
    </Base>
  );
}

export function IconAward({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9 13.5L7.5 21l4.5-2.5L16.5 21 15 13.5" />
    </Base>
  );
}

export function IconArrow({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </Base>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M14 4H6v16h8" />
      <path d="M10 12h11" />
      <path d="M18 8l3 4-3 4" />
    </Base>
  );
}

export function IconBox({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5" />
      <path d="M12 12L4 7.5" />
      <path d="M12 12v9" />
    </Base>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Base>
  );
}

export function IconMinus({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M5 12h14" />
    </Base>
  );
}
