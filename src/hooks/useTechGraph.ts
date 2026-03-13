import { useEffect, useRef, useState, useCallback } from 'react';
import { CosmosGraph } from '../graph';
import type { GraphState } from '../graph';
import { TechTree, TechNode, DomainId } from '../types';

const DEBUG_GRAPH = false;
function debugLog(_section: string, _message: string, _data?: unknown): void {
  if (!DEBUG_GRAPH) return;
}

export interface UseTechGraphOptions {
  onNodeSelect?: (node: TechNode | null) => void;
  onNodeHover?: (node: TechNode | null) => void;
}

export interface NodeScreenPosition {
  node: TechNode;
  x: number;
  y: number;
}

export interface UseTechGraphReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  graphState: GraphState;
  selectedNode: TechNode | null;
  hoveredNode: TechNode | null;
  isReady: boolean;
  getNodeScreenPositions: () => NodeScreenPosition[];
  zoomToNode: (nodeId: string) => void;
  selectNodeById: (nodeId: string) => void;
  zoomToDomain: (domainId: DomainId) => void;
  fitView: () => void;
  filterByDomains: (domainIds: DomainId[]) => void;
  clearSelection: () => void;
}

/** Keep options in a ref so graph init effect runs only when techTree changes; callbacks stay current. */
export function useTechGraph(
  techTree: TechTree,
  options: UseTechGraphOptions = {}
): UseTechGraphReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<CosmosGraph | null>(null);
  const techTreeRef = useRef(techTree);
  techTreeRef.current = techTree;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [isReady, setIsReady] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TechNode | null>(null);
  const [graphState, setGraphState] = useState<GraphState>({
    selectedNodeIndex: null,
    hoveredNodeIndex: null,
    highlightedIndices: [],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      debugLog('effect', 'No containerRef.current, skipping mount');
      return;
    }

    let cancelled = false;
    let mountCleanup: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const doMount = (): void => {
      if (cancelled) return;
      const tree = techTreeRef.current;
      debugLog('effect', 'Creating CosmosGraph and mounting', {
        nodeCount: tree.nodes.length,
        linkCount: tree.links.length,
      });

      const graph = new CosmosGraph(tree, {
        onNodeClick: (node) => {
          debugLog('callback', 'onNodeClick', { nodeId: node.id, name: node.name });
          setSelectedNode(node);
          setGraphState((prev) => ({
            ...prev,
            selectedNodeIndex: graphRef.current?.getState().selectedNodeIndex ?? null,
          }));
          optionsRef.current.onNodeSelect?.(node);
        },
        onNodeHover: (node) => {
          setHoveredNode(node);
          setGraphState((prev) => ({
            ...prev,
            hoveredNodeIndex: graphRef.current?.getState().hoveredNodeIndex ?? null,
          }));
          optionsRef.current.onNodeHover?.(node);
        },
        onBackgroundClick: () => {
          debugLog('callback', 'onBackgroundClick');
          setSelectedNode(null);
          setGraphState((prev) => ({ ...prev, selectedNodeIndex: null, highlightedIndices: [] }));
          optionsRef.current.onNodeSelect?.(null);
        },
        onSimulationEnd: () => {
          debugLog('callback', 'onSimulationEnd');
          console.log('[AxisDebug] isReady set to true (onSimulationEnd)');
          setIsReady(true);
        },
      });

      graph.mount(container);
      graphRef.current = graph;
      const rect = container.getBoundingClientRect();
      console.log('[AxisDebug] useTechGraph: graph mounted', {
        containerRect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
        isReadyWillBeSetIn: '500ms or onSimulationEnd',
      });
      debugLog('effect', 'Mounted; isReady after 500ms or onSimulationEnd');

      const timer = setTimeout(() => {
        console.log('[AxisDebug] isReady set to true (500ms timeout)');
        setIsReady(true);
      }, 500);

      mountCleanup = () => {
        clearTimeout(timer);
        graph.destroy();
        graphRef.current = null;
      };
    };

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      const rect = container.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        debugLog('effect', 'Container has no size yet, waiting for resize');
        resizeObserver = new ResizeObserver(() => {
          if (cancelled) return;
          const r = container.getBoundingClientRect();
          if (r.width >= 10 && r.height >= 10) {
            resizeObserver?.disconnect();
            resizeObserver = null;
            doMount();
          }
        });
        resizeObserver.observe(container);
      } else {
        doMount();
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      resizeObserver = null;
      debugLog('effect', 'Cleanup: destroying graph');
      mountCleanup?.();
    };
  }, []);

  // When techTree changes (e.g. timeline year), update graph data without remounting
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.setTechTree(techTree);
    }
  }, [techTree]);

  const zoomToNode = useCallback((nodeId: string) => {
    graphRef.current?.zoomToNode(nodeId);
  }, []);

  /** Select a node by ID (opens detail and zooms to it). Use from dependency links etc. */
  const selectNodeById = useCallback(
    (nodeId: string) => {
      const node = techTree.nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        graphRef.current?.zoomToNode(nodeId);
        optionsRef.current.onNodeSelect?.(node);
      }
    },
    [techTree.nodes]
  );

  const zoomToDomain = useCallback((domainId: DomainId) => {
    graphRef.current?.zoomToDomain(domainId);
  }, []);

  const fitView = useCallback(() => {
    graphRef.current?.fitView();
  }, []);

  const filterByDomains = useCallback((domainIds: DomainId[]) => {
    graphRef.current?.filterByDomains(domainIds);
  }, []);

  const clearSelection = useCallback(() => {
    graphRef.current?.clearHighlight();
    setSelectedNode(null);
    optionsRef.current.onNodeSelect?.(null);
  }, []);

  const getNodeScreenPositions = useCallback((): NodeScreenPosition[] => {
    return graphRef.current?.getNodeScreenPositions() ?? [];
  }, []);

  return {
    containerRef,
    graphState,
    selectedNode,
    hoveredNode,
    isReady,
    getNodeScreenPositions,
    zoomToNode,
    selectNodeById,
    zoomToDomain,
    fitView,
    filterByDomains,
    clearSelection,
  };
}

export default useTechGraph;
