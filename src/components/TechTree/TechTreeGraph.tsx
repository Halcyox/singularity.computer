import React, { useEffect } from 'react';
import { TechNode, DomainId } from '../../types';
import { getDomainColor } from '../../data/domains';
import type { NodeScreenPosition } from '../../hooks/useTechGraph';
import { TierTrlAxesOverlay } from '../../features/tech-tree';
import { useLabelPositions, useTooltipPosition } from './hooks';
import { NodeLabelsOverlay } from './NodeLabelsOverlay';
import { SelectionRingOverlay } from './SelectionRingOverlay';
import { GraphTooltip } from './GraphTooltip';
import { GraphLoadingOverlay } from './GraphLoadingOverlay';
import './TechTreeGraph.css';

export interface TechTreeGraphProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedNode: TechNode | null;
  hoveredNode: TechNode | null;
  isReady: boolean;
  getNodeScreenPositions: () => NodeScreenPosition[];
  activeDomains: DomainId[];
  filterByDomains: (domainIds: DomainId[]) => void;
  className?: string;
}

export const TechTreeGraph: React.FC<TechTreeGraphProps> = ({
  containerRef,
  selectedNode,
  hoveredNode,
  isReady,
  getNodeScreenPositions,
  activeDomains,
  filterByDomains,
  className = '',
}) => {
  const labelPositions = useLabelPositions({
    containerRef,
    getNodeScreenPositions,
    activeDomains,
    isReady,
  });

  const tooltipPosition = useTooltipPosition(hoveredNode);

  useEffect(() => {
    if (isReady) filterByDomains(activeDomains);
  }, [activeDomains, isReady, filterByDomains]);

  const showTooltip = Boolean(hoveredNode && !selectedNode);

  return (
    <div className={`tech-tree-graph ${className}`}>
      <div ref={containerRef} className="tech-tree-canvas" />

      <TierTrlAxesOverlay
        containerRef={containerRef}
        getNodeScreenPositions={getNodeScreenPositions}
        visible={isReady}
      />

      <NodeLabelsOverlay
        positions={labelPositions}
        getDomainColor={getDomainColor}
        visible={isReady}
      />

      <SelectionRingOverlay
        containerRef={containerRef}
        getNodeScreenPositions={getNodeScreenPositions}
        selectedNode={selectedNode}
        visible={isReady}
      />

      <GraphLoadingOverlay show={!isReady} />

      {showTooltip && hoveredNode && (
        <GraphTooltip
          node={hoveredNode}
          position={tooltipPosition}
          domainColor={getDomainColor(hoveredNode.domain)}
        />
      )}
    </div>
  );
};

export default TechTreeGraph;
