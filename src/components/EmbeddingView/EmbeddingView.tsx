import React, { useEffect, useRef, useCallback } from 'react';
import createScatterplot from 'regl-scatterplot';
import { TechNode } from '../../types';
import { DOMAIN_LIST } from '../../data/domains';
import { getEmbeddingPositions, normalizeToNDC } from '../../utils/embeddingPositions';
import './EmbeddingView.css';

export interface EmbeddingViewProps {
  nodes: TechNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: TechNode | null) => void;
  className?: string;
}

const DOMAIN_IDS = DOMAIN_LIST.map((d) => d.id);
const DOMAIN_COLORS = DOMAIN_LIST.map((d) => d.color);

/** Size map for continuous importance 0–1: 10 steps from 3 to 14 */
const SIZE_MAP = Array.from({ length: 11 }, (_, i) => 3 + (i / 10) * 11);

export const EmbeddingView: React.FC<EmbeddingViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scatterRef = useRef<ReturnType<typeof createScatterplot> | null>(null);
  const nodesRef = useRef<TechNode[]>([]);

  nodesRef.current = nodes;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const scatter = createScatterplot({
      canvas,
      width,
      height,
      colorBy: 'valueA',
      sizeBy: 'valueB',
      pointColor: DOMAIN_COLORS,
      pointSize: SIZE_MAP,
      opacity: 0.9,
      backgroundColor: '#0a0a1a',
    });

    scatterRef.current = scatter;

    scatter.subscribe('select', ({ points: selectedIndices }) => {
      if (selectedIndices.length === 0) {
        onSelectNode(null);
        return;
      }
      const idx = selectedIndices[0];
      const node = nodesRef.current[idx];
      if (node) onSelectNode(node);
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !scatterRef.current) return;
      const { width: w, height: h } = entry.contentRect;
      scatterRef.current.set({ width: w, height: h });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      scatter.destroy();
      scatterRef.current = null;
      container.removeChild(canvas);
    };
  }, [onSelectNode]);

  useEffect(() => {
    const scatter = scatterRef.current;
    if (!scatter || nodes.length === 0) return;

    const { positions, bounds } = getEmbeddingPositions(nodes);
    const ndc = normalizeToNDC(positions, bounds);

    const points: Array<[number, number, number, number]> = nodes.map((node, i) => {
      const [x, y] = ndc[i];
      const domainIndex = DOMAIN_IDS.indexOf(node.domain);
      const importanceNorm = (node.importance - 1) / 9;
      return [x, y, domainIndex >= 0 ? domainIndex : 0, importanceNorm];
    });

    scatter.draw(points);
  }, [nodes]);

  useEffect(() => {
    const scatter = scatterRef.current;
    if (!scatter || nodes.length === 0) return;
    if (selectedNodeId === null) {
      scatter.select([]);
      return;
    }
    const idx = nodes.findIndex((n) => n.id === selectedNodeId);
    if (idx >= 0) scatter.select([idx]);
  }, [selectedNodeId, nodes]);

  return (
    <div ref={containerRef} className={`embedding-view ${className}`} />
  );
};

export default EmbeddingView;
