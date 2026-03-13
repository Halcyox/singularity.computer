import React from 'react';
import type { LabelPlacement } from './hooks/useLabelPositions';

export interface NodeLabelsOverlayProps {
  positions: LabelPlacement[];
  getDomainColor: (domainId: string) => string;
  /** When false, nothing is rendered. */
  visible: boolean;
}

export const NodeLabelsOverlay: React.FC<NodeLabelsOverlayProps> = ({
  positions,
  getDomainColor,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="tech-tree-labels" aria-hidden="true">
      {positions.map(({ node, labelLeft, labelTop }) => (
        <div
          key={node.id}
          className="tech-tree-label"
          style={{
            left: labelLeft,
            top: labelTop,
            borderColor: getDomainColor(node.domain),
          }}
        >
          {node.name}
        </div>
      ))}
    </div>
  );
};

export default NodeLabelsOverlay;
