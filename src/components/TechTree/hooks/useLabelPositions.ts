import { useEffect, useState } from 'react';
import type { NodeScreenPosition } from '../../../hooks/useTechGraph';
import type { DomainId } from '../../../types';
import { computeLabelPlacement, type LabelPlacement } from './labelPlacement';

const VIEWPORT_MARGIN = 50;

/** Show label only for high-importance or achieved/in-progress nodes; rest rely on tooltip. */
function shouldShowLabel(node: NodeScreenPosition['node']): boolean {
  if (node.importance >= 7) return true;
  if (node.status === 'achieved' || node.status === 'in_progress') return true;
  return false;
}

export interface UseLabelPositionsArgs {
  containerRef: React.RefObject<HTMLDivElement | null>;
  getNodeScreenPositions: () => NodeScreenPosition[];
  activeDomains: DomainId[];
  isReady: boolean;
}

export type { LabelPlacement };

/**
 * Returns label placements for nodes in view: filtered by domains, priority, container-relative coords, and greedy placement to reduce overlap.
 */
export function useLabelPositions({
  containerRef,
  getNodeScreenPositions,
  activeDomains,
  isReady,
}: UseLabelPositionsArgs): LabelPlacement[] {
  const [positions, setPositions] = useState<LabelPlacement[]>([]);

  useEffect(() => {
    if (!isReady) return;

    let rafId: number;

    const tick = () => {
      const raw = getNodeScreenPositions();
      const byDomain =
        activeDomains.length === 0
          ? raw
          : raw.filter((p) => activeDomains.includes(p.node.domain));

      const container = containerRef.current;
      if (!container) {
        setPositions([]);
      } else {
        const rect = container.getBoundingClientRect();
        const inView = byDomain.filter(
          (p) =>
            p.x >= rect.left - VIEWPORT_MARGIN &&
            p.x <= rect.right + VIEWPORT_MARGIN &&
            p.y >= rect.top - VIEWPORT_MARGIN &&
            p.y <= rect.bottom + VIEWPORT_MARGIN
        );
        const withLabels = inView.filter((p) => shouldShowLabel(p.node));
        const containerRelative: NodeScreenPosition[] = withLabels.map(
          (p) => ({
            node: p.node,
            x: p.x - rect.left,
            y: p.y - rect.top,
          })
        );
        setPositions(computeLabelPlacement(containerRelative));
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isReady, getNodeScreenPositions, containerRef, activeDomains]);

  return positions;
}
