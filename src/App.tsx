import React, { useState, useCallback } from 'react';
import {
  TechTreeGraph,
  EmbeddingView,
  NodeDetail,
  DomainFilter,
  Header,
} from './components';
import type { ViewMode } from './components/TechTree/Header';
import { TECH_TREE, NODE_MAP } from './data';
import { useTechGraph } from './hooks';
import type { DomainId, TechNode } from './types';
import './App.css';

const App: React.FC = () => {
  const [activeDomains, setActiveDomains] = useState<DomainId[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [embeddingSelectedNode, setEmbeddingSelectedNode] = useState<TechNode | null>(null);

  const {
    containerRef,
    selectedNode: graphSelectedNode,
    hoveredNode,
    isReady,
    getNodeScreenPositions,
    fitView,
    filterByDomains,
    clearSelection: clearGraphSelection,
    selectNodeById: graphSelectNodeById,
  } = useTechGraph(TECH_TREE);

  const selectedNode =
    viewMode === 'graph' ? graphSelectedNode : embeddingSelectedNode;
  const clearSelection =
    viewMode === 'graph'
      ? clearGraphSelection
      : () => setEmbeddingSelectedNode(null);

  const handleToggleDomain = useCallback((domainId: DomainId) => {
    setActiveDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId]
    );
  }, []);

  const handleClearDomains = useCallback(() => setActiveDomains([]), []);

  const handleSelectNodeId = useCallback(
    (nodeId: string) => {
      if (viewMode === 'graph') {
        graphSelectNodeById(nodeId);
      } else {
        const node = NODE_MAP.get(nodeId) ?? null;
        setEmbeddingSelectedNode(node);
      }
    },
    [viewMode, graphSelectNodeById]
  );

  return (
    <div className="app">
      {viewMode === 'graph' ? (
        <TechTreeGraph
          containerRef={containerRef}
          selectedNode={graphSelectedNode}
          hoveredNode={hoveredNode}
          isReady={isReady}
          getNodeScreenPositions={getNodeScreenPositions}
          activeDomains={activeDomains}
          filterByDomains={filterByDomains}
        />
      ) : (
        <EmbeddingView
          nodes={TECH_TREE.nodes}
          selectedNodeId={embeddingSelectedNode?.id ?? null}
          onSelectNode={setEmbeddingSelectedNode}
        />
      )}

      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFitView={viewMode === 'graph' ? fitView : undefined}
      />

      {viewMode === 'graph' && (
        <DomainFilter
          activeDomains={activeDomains}
          onToggle={handleToggleDomain}
          onClear={handleClearDomains}
        />
      )}

      {selectedNode && (
        <NodeDetail
          node={selectedNode}
          onClose={clearSelection}
          onSelectNodeId={handleSelectNodeId}
        />
      )}

      <div className="app-footer">
        <span>{viewMode === 'graph' ? 'Cosmos.gl' : 'regl-scatterplot'}</span>
        <span className="footer-sep">|</span>
        <span>Data updated {new Date().toLocaleDateString()}</span>
        {viewMode === 'graph' && (
          <>
            <span className="footer-sep">|</span>
            <span className="footer-definitions">
              <strong>TRL</strong> = Technology Readiness Level (1–9);
              <strong> Tier</strong> = 0 (foundational) → 5 (advanced)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
