import { useState, useEffect, useRef } from 'react';
import type { NodeScreenPosition } from '../../../hooks/useTechGraph';

const AXIS_PADDING = 36;

export interface AxesBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
}

export function useAxesBounds(
  containerRef: React.RefObject<HTMLDivElement | null>,
  getNodeScreenPositions: () => NodeScreenPosition[],
  visible: boolean
): AxesBounds | null {
  const [bounds, setBounds] = useState<AxesBounds | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const update = () => {
      const el = containerRef.current;
      const positions = getNodeScreenPositions();
      if (!el || positions.length === 0) return;

      const rect = el.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      let minSx = Infinity,
        maxSx = -Infinity,
        minSy = Infinity,
        maxSy = -Infinity;
      positions.forEach(({ x, y }) => {
        minSx = Math.min(minSx, x - rect.left);
        maxSx = Math.max(maxSx, x - rect.left);
        minSy = Math.min(minSy, y - rect.top);
        maxSy = Math.max(maxSy, y - rect.top);
      });

      if (minSx === Infinity) return;

      const pad = AXIS_PADDING;
      const left = Math.max(0, minSx - pad);
      const right = Math.min(containerWidth, maxSx + pad);
      const top = Math.max(0, minSy - pad);
      const bottom = Math.min(containerHeight, maxSy + pad);

      setBounds({
        left,
        right,
        top,
        bottom,
        width: right - left,
        height: bottom - top,
        containerWidth,
        containerHeight,
      });
    };

    const tick = () => {
      update();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, containerRef, getNodeScreenPositions]);

  return bounds;
}
