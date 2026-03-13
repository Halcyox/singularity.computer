import React from 'react';
import type { NodeScreenPosition } from '../../../hooks/useTechGraph';
import { useAxesBounds } from '../hooks/useAxesBounds';
import './TierTrlAxesOverlay.css';

const TIER_TICKS = [0, 1, 2, 3, 4, 5];
const TRL_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICK_LENGTH = 6;

export interface TierTrlAxesOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  getNodeScreenPositions: () => NodeScreenPosition[];
  visible: boolean;
}

export const TierTrlAxesOverlay: React.FC<TierTrlAxesOverlayProps> = ({
  containerRef,
  getNodeScreenPositions,
  visible,
}) => {
  const bounds = useAxesBounds(containerRef, getNodeScreenPositions, visible);

  if (!visible || !bounds || bounds.width <= 0 || bounds.height <= 0) return null;

  const { left, top, width, height } = bounds;
  const xScale = (trl: number) => left + ((trl - 1) / 8) * width;
  const yScale = (tier: number) => top + height - (tier / 5) * height;

  return (
    <svg
      className="tier-trl-axes-overlay"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: bounds.containerWidth,
        height: bounds.containerHeight,
        pointerEvents: 'none',
      }}
    >
      {/* Adaptive grid: vertical at TRL 1..9, horizontal at Tier 0..5 */}
      {TRL_TICKS.map((trl) => {
        const x = xScale(trl);
        return (
          <line
            key={`v-${trl}`}
            x1={x}
            y1={top}
            x2={x}
            y2={top + height}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
        );
      })}
      {TIER_TICKS.map((tier) => {
        const y = yScale(tier);
        return (
          <line
            key={`h-${tier}`}
            x1={left}
            y1={y}
            x2={left + width}
            y2={y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Y axis (Tier) - left edge */}
      <line
        x1={left}
        y1={top}
        x2={left}
        y2={top + height}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      {TIER_TICKS.map((tier) => {
        const y = yScale(tier);
        return (
          <g key={`ytick-${tier}`}>
            <line x1={left} y1={y} x2={left - TICK_LENGTH} y2={y} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <text
              x={left - TICK_LENGTH - 4}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="tier-trl-axis-label tier-trl-axis-label-y"
            >
              {tier}
            </text>
          </g>
        );
      })}
      <text
        x={left - TICK_LENGTH - 20}
        y={top + height / 2}
        textAnchor="middle"
        className="tier-trl-axis-title tier-trl-axis-title-y"
        transform={`rotate(-90, ${left - TICK_LENGTH - 20}, ${top + height / 2})`}
      >
        Tier
      </text>

      {/* X axis (TRL) - bottom edge */}
      <line
        x1={left}
        y1={top + height}
        x2={left + width}
        y2={top + height}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      {TRL_TICKS.map((trl) => {
        const x = xScale(trl);
        return (
          <g key={`xtick-${trl}`}>
            <line x1={x} y1={top + height} x2={x} y2={top + height + TICK_LENGTH} stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <text
              x={x}
              y={top + height + TICK_LENGTH + 14}
              textAnchor="middle"
              className="tier-trl-axis-label tier-trl-axis-label-x"
            >
              {trl}
            </text>
          </g>
        );
      })}
      <text
        x={left + width / 2}
        y={top + height + TICK_LENGTH + 32}
        textAnchor="middle"
        className="tier-trl-axis-title tier-trl-axis-title-x"
      >
        TRL
      </text>
    </svg>
  );
};

export default TierTrlAxesOverlay;
