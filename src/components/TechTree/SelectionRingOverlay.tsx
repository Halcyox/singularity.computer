import React, { useState, useEffect, useRef } from 'react';
import type { TechNode } from '../../types';
import type { NodeScreenPosition } from '../../hooks/useTechGraph';

const RING_RADIUS = 18;
const RING_STROKE = 3;

export interface SelectionRingOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  getNodeScreenPositions: () => NodeScreenPosition[];
  selectedNode: TechNode | null;
  visible: boolean;
}

export const SelectionRingOverlay: React.FC<SelectionRingOverlayProps> = ({
  containerRef,
  getNodeScreenPositions,
  selectedNode,
  visible,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible || !selectedNode || !containerRef.current) {
      setPosition(null);
      return;
    }

    const tick = () => {
      const el = containerRef.current;
      const positions = getNodeScreenPositions();
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const pos = positions.find((p) => p.node.id === selectedNode.id);
      if (pos) {
        setPosition({
          x: pos.x - rect.left,
          y: pos.y - rect.top,
        });
      } else {
        setPosition(null);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, selectedNode?.id, containerRef, getNodeScreenPositions]);

  if (!visible || !selectedNode || !position) return null;

  return (
    <div
      className="selection-ring-overlay"
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <circle
          className="selection-ring"
          cx={position.x}
          cy={position.y}
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth={RING_STROKE}
        />
        <circle
          className="selection-ring selection-ring-outer"
          cx={position.x}
          cy={position.y}
          r={RING_RADIUS + 4}
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

export default SelectionRingOverlay;
