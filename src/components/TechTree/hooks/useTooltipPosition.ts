import { useEffect, useState, useRef } from 'react';
import type { TechNode } from '../../../types';

const THROTTLE_MS = 50;

/**
 * Returns the current mouse position, updated only when a node is hovered (for tooltip placement).
 * Uses throttled mousemove and a ref for the latest position so the tooltip has a valid position on first paint.
 */
export function useTooltipPosition(hoveredNode: TechNode | null): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const latestRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(0);

  useEffect(() => {
    const sync = (e: MouseEvent) => {
      latestRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', sync, { passive: true });
    return () => window.removeEventListener('mousemove', sync);
  }, []);

  useEffect(() => {
    if (!hoveredNode) return;
    setPosition(latestRef.current);

    const handleMove = (e: MouseEvent) => {
      latestRef.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastTsRef.current >= THROTTLE_MS) {
        lastTsRef.current = now;
        setPosition(latestRef.current);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [hoveredNode]);

  return position;
}
