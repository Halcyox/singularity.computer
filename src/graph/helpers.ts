import type { TechNode, NodeStatus } from '../types';
import {
  NODE_SIZE_BASE,
  NODE_SIZE_IMPORTANCE_SCALE,
  NODE_SIZE_STATUS_ACHIEVED,
  NODE_SIZE_STATUS_IN_PROGRESS,
  NODE_SIZE_INACTIVE,
} from './constants';

export function hexToRgba(hex: string, alpha = 1): [number, number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, alpha];
}

export function getStatusModifier(status: NodeStatus): number {
  switch (status) {
    case 'achieved':
      return 1.0;
    case 'in_progress':
      return 0.85;
    case 'theoretical':
      return 0.6;
    case 'speculative':
      return 0.4;
    default:
      return 1.0;
  }
}

/** Node radius for rendering; used by generateSizes and filterByDomains. */
export function getNodeSize(node: TechNode, active = true): number {
  const baseSize = NODE_SIZE_BASE + node.importance * NODE_SIZE_IMPORTANCE_SCALE;
  const statusBoost =
    node.status === 'achieved'
      ? NODE_SIZE_STATUS_ACHIEVED
      : node.status === 'in_progress'
        ? NODE_SIZE_STATUS_IN_PROGRESS
        : 1.0;
  return active ? baseSize * statusBoost : NODE_SIZE_INACTIVE;
}
