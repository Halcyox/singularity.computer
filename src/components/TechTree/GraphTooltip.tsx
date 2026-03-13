import React from 'react';
import type { TechNode } from '../../types';
import { getNodeTRL } from '../../utils/trl';
import { STATUS_LABELS } from '../../constants/status';

const OFFSET = 15;

export interface GraphTooltipProps {
  node: TechNode;
  /** Screen position (e.g. from useTooltipPosition). */
  position: { x: number; y: number };
  domainColor: string;
}

export const GraphTooltip: React.FC<GraphTooltipProps> = ({
  node,
  position,
  domainColor,
}) => (
  <div
    className="tech-tree-tooltip"
    style={{
      left: position.x + OFFSET,
      top: position.y + OFFSET,
    }}
    role="tooltip"
  >
    <div
      className="tooltip-indicator"
      style={{ backgroundColor: domainColor }}
      aria-hidden
    />
    <div className="tooltip-content">
      <div className="tooltip-title">{node.name}</div>
      <div className="tooltip-meta">
        <span className="tooltip-domain">{node.domain.toUpperCase()}</span>
        <span className="tooltip-sep"> · </span>
        <span>{STATUS_LABELS[node.status]}</span>
        <span className="tooltip-sep"> · </span>
        <span>TRL {getNodeTRL(node)}</span>
      </div>
    </div>
  </div>
);

export default GraphTooltip;
