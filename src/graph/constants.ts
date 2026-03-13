/**
 * Shared layout and rendering constants for the tech graph and embedding view.
 * Single source of truth so graph and embedding layouts stay aligned.
 */

/** Domain-ring layout: base radius spread per node */
export const LAYOUT_SPREAD_BASE = 120;
/** Domain-ring layout: extra radius per tier */
export const LAYOUT_SPREAD_PER_TIER = 45;
/** Golden angle (deg) for spacing nodes within a domain ring */
export const GOLDEN_ANGLE_DEG = 137.508;

/** Vertical offset for tier rings (higher tier = further from domain center) */
export const LAYOUT_TIER_RING_SCALE = 1.4;

/** Layout mode: domainRings = by domain/tier; tierTrl = X=TRL, Y=Tier for axes */
export const LAYOUT_MODE: 'domainRings' | 'tierTrl' = 'tierTrl';
export const LAYOUT_TRL_SCALE = 55;
export const LAYOUT_TIER_SCALE = 70;
/** Spacing between nodes in the same (tier, TRL) cell */
export const LAYOUT_CELL_SPREAD = 22;

/** Node size (radius) base + importance scale */
export const NODE_SIZE_BASE = 0.9;
export const NODE_SIZE_IMPORTANCE_SCALE = 0.45;
export const NODE_SIZE_STATUS_ACHIEVED = 1.08;
export const NODE_SIZE_STATUS_IN_PROGRESS = 1.03;
export const NODE_SIZE_INACTIVE = 0.6;
