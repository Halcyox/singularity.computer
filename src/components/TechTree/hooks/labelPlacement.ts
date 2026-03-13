import type { NodeScreenPosition } from '../../../hooks/useTechGraph';
import type { TechNode } from '../../../types';

const LABEL_HEIGHT = 26;
const LABEL_CH_WIDTH = 8;
const LABEL_PADDING_X = 16;
const MIN_LABEL_WIDTH = 80;
/** Extra space reserved around each placed label when choosing next position (still allow overlap) */
const LABEL_MARGIN = 6;

function estimateLabelWidth(node: TechNode): number {
  return Math.max(MIN_LABEL_WIDTH, node.name.length * LABEL_CH_WIDTH + LABEL_PADDING_X);
}

/** Candidate anchor offsets (dx, dy) from node center; label is drawn with top-left at (nodeX + dx, nodeY + dy). */
const CANDIDATES: [number, number][] = [
  [0, -LABEL_HEIGHT - 4],    // above
  [0, 4],                    // below
  [-1, 0],                   // left (vertically centered)
  [1, 0],                    // right
  [-0.7, -LABEL_HEIGHT - 2], // above-left
  [0.7, -LABEL_HEIGHT - 2],  // above-right
  [-0.7, 2],                 // below-left
  [0.7, 2],                  // below-right
];

function getLabelRect(
  nodeX: number,
  nodeY: number,
  width: number,
  [dxUnit, dyUnit]: [number, number]
): { left: number; top: number; width: number; height: number } {
  const w = width;
  const h = LABEL_HEIGHT;
  if (dxUnit === 0) {
    return { left: nodeX - w / 2, top: nodeY + dyUnit, width: w, height: h };
  }
  const dx = dxUnit > 0 ? 4 : -w - 4;
  const top = nodeY - h / 2;
  return { left: nodeX + dx, top, width: w, height: h };
}

function overlapArea(
  a: { left: number; top: number; width: number; height: number },
  b: { left: number; top: number; width: number; height: number }
): number {
  const x1 = Math.max(a.left, b.left);
  const x2 = Math.min(a.left + a.width, b.left + b.width);
  const y1 = Math.max(a.top, b.top);
  const y2 = Math.min(a.top + a.height, b.top + b.height);
  if (x2 <= x1 || y2 <= y1) return 0;
  return (x2 - x1) * (y2 - y1);
}

export interface LabelPlacement {
  node: TechNode;
  x: number;
  y: number;
  labelLeft: number;
  labelTop: number;
}

/**
 * Greedy label placement: sort by importance (desc), for each try 8 candidate positions, pick the one with minimum overlap with already-placed labels.
 */
export function computeLabelPlacement(positions: NodeScreenPosition[]): LabelPlacement[] {
  const sorted = [...positions].sort((a, b) => b.node.importance - a.node.importance);
  const placed: { left: number; top: number; width: number; height: number }[] = [];
  const result: LabelPlacement[] = [];

  for (const { node, x, y } of sorted) {
    const w = estimateLabelWidth(node);
    let best: { left: number; top: number } | null = null;
    let bestOverlap = Infinity;

    for (const cand of CANDIDATES) {
      const rect = getLabelRect(x, y, w, cand);
      let totalOverlap = 0;
      for (const other of placed) {
        totalOverlap += overlapArea(rect, other);
      }
      if (totalOverlap < bestOverlap) {
        bestOverlap = totalOverlap;
        best = { left: rect.left, top: rect.top };
      }
    }

    if (best) {
      result.push({ node, x, y, labelLeft: best.left, labelTop: best.top });
      placed.push({
        left: best.left - LABEL_MARGIN,
        top: best.top - LABEL_MARGIN,
        width: w + LABEL_MARGIN * 2,
        height: LABEL_HEIGHT + LABEL_MARGIN * 2,
      });
    }
  }

  return result;
}
