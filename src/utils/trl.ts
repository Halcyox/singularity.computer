/**
 * Technology Readiness Level (TRL) helpers for organizing the tech tree.
 * TRL 1–9: https://en.wikipedia.org/wiki/Technology_readiness_level
 */

import type { TechNode, TRL as TRLType, NodeStatus } from '../types';

/** TRL bands for filtering/grouping */
export const TRL_BANDS = [
  { min: 1, max: 3, label: 'Research & concept (TRL 1–3)' },
  { min: 4, max: 6, label: 'Validation & prototype (TRL 4–6)' },
  { min: 7, max: 9, label: 'System & operational (TRL 7–9)' },
] as const;

/** Default TRL by status when node has no explicit trl */
const STATUS_TO_TRL: Record<NodeStatus, TRLType> = {
  achieved: 9,
  in_progress: 5,
  theoretical: 3,
  speculative: 1,
};

/**
 * Tier nudges TRL within status band: higher tier = slightly higher TRL.
 * Keeps derived TRL in 1–9.
 */
function tierNudge(tier: number, base: TRLType): TRLType {
  const nudge = Math.min(2, Math.max(0, Math.floor(tier / 2)));
  return Math.min(9, Math.max(1, (base + nudge) as TRLType)) as TRLType;
}

/**
 * Returns the effective TRL for a node (explicit trl or derived from status/tier).
 */
export function getNodeTRL(node: TechNode): TRLType {
  if (node.trl != null) return node.trl;
  const base = STATUS_TO_TRL[node.status];
  return tierNudge(node.tier, base);
}

/**
 * Whether a node's TRL falls within [min, max] (inclusive).
 */
export function isTRLInRange(node: TechNode, min: number, max: number): boolean {
  const trl = getNodeTRL(node);
  return trl >= min && trl <= max;
}
