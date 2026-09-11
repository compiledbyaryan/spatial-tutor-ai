import {
  IconArrowLeft,
  IconArrowRight,
  IconAward as TablerAward,
  IconBox as TablerBox,
  IconBulb as TablerBulb,
  IconCheck as TablerCheck,
  IconCrosshair,
  IconEye as TablerEye,
  IconLogout as TablerLogout,
  IconMinus as TablerMinus,
  IconPlus as TablerPlus,
  IconRefresh,
  IconRotateClockwise,
  IconSend as TablerSend,
  IconSparkles,
  IconStack2,
  IconSwords as TablerSwords,
  IconX,
} from "@tabler/icons-react";

type IconProps = { className?: string | undefined };

/** Single icon family (Tabler) at one stroke width across the whole app. */
const STROKE = 1.75;

export function IconBack({ className }: IconProps) {
  return <IconArrowLeft className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconLayers({ className }: IconProps) {
  return <IconStack2 className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconOrbit({ className }: IconProps) {
  return <IconRotateClockwise className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconReset({ className }: IconProps) {
  return <IconRefresh className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconTarget({ className }: IconProps) {
  return <IconCrosshair className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconSpark({ className }: IconProps) {
  return <IconSparkles className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconSend({ className }: IconProps) {
  return <TablerSend className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconEye({ className }: IconProps) {
  return <TablerEye className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconSwords({ className }: IconProps) {
  return <TablerSwords className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconCheck({ className }: IconProps) {
  return <TablerCheck className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconCross({ className }: IconProps) {
  return <IconX className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconClose({ className }: IconProps) {
  return <IconX className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconBulb({ className }: IconProps) {
  return <TablerBulb className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconAward({ className }: IconProps) {
  return <TablerAward className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconArrow({ className }: IconProps) {
  return <IconArrowRight className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconLogout({ className }: IconProps) {
  return <TablerLogout className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconBox({ className }: IconProps) {
  return <TablerBox className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconPlus({ className }: IconProps) {
  return <TablerPlus className={className} strokeWidth={STROKE} aria-hidden />;
}

export function IconMinus({ className }: IconProps) {
  return <TablerMinus className={className} strokeWidth={STROKE} aria-hidden />;
}
