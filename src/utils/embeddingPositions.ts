/**
 * Shared 2D layout for embedding-style view (domain clusters + golden angle).
 * Uses graph constants so layout matches CosmosGraph domainRings mode.
 */
import { TechNode } from '../types';
import { DOMAINS } from '../data/domains';
import {
  LAYOUT_SPREAD_BASE,
  LAYOUT_SPREAD_PER_TIER,
  GOLDEN_ANGLE_DEG,
} from '../graph/constants';

export interface EmbeddingBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface EmbeddingPosition {
  x: number;
  y: number;
}

/**
 * Returns 2D positions for each node (same layout as CosmosGraph) and bounds.
 */
export function getEmbeddingPositions(nodes: TechNode[]): {
  positions: EmbeddingPosition[];
  bounds: EmbeddingBounds;
} {
  const domainIndices: Record<string, number> = {};
  const positions: EmbeddingPosition[] = [];

  for (const node of nodes) {
    const domain = DOMAINS[node.domain];
    const baseX = domain.position?.[0] ?? 0;
    const baseY = domain.position?.[1] ?? 0;

    const indexInDomain = domainIndices[node.domain] ?? 0;
    domainIndices[node.domain] = indexInDomain + 1;

    const spread = LAYOUT_SPREAD_BASE + node.tier * LAYOUT_SPREAD_PER_TIER;
    const angle = (indexInDomain * GOLDEN_ANGLE_DEG * Math.PI) / 180;
    const radius = spread * Math.sqrt(indexInDomain + 1);

    const x = baseX + Math.cos(angle) * radius;
    const y = baseY + Math.sin(angle) * radius;

    positions.push({ x, y });
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of positions) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }

  return {
    positions,
    bounds: { minX, maxX, minY, maxY },
  };
}

/**
 * Normalize position to NDC [-1, 1] for regl-scatterplot when not using D3 scales.
 */
export function normalizeToNDC(
  positions: EmbeddingPosition[],
  bounds: EmbeddingBounds
): Array<[number, number]> {
  const { minX, maxX, minY, maxY } = bounds;
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return positions.map((p) => [
    (p.x - minX) / rangeX * 2 - 1,
    (p.y - minY) / rangeY * 2 - 1,
  ]);
}
