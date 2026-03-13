import { Graph, GraphConfigInterface } from '@cosmos.gl/graph';
import { TechTree, TechNode, DomainId } from '../types';
import { DOMAINS } from '../data/domains';
import { NODE_INDEX_MAP } from '../data';
import { getNodeTRL } from '../utils/trl';
import {
  LAYOUT_SPREAD_BASE,
  LAYOUT_SPREAD_PER_TIER,
  GOLDEN_ANGLE_DEG,
  LAYOUT_TIER_RING_SCALE,
  LAYOUT_MODE,
  LAYOUT_TRL_SCALE,
  LAYOUT_TIER_SCALE,
  LAYOUT_CELL_SPREAD,
} from './constants';
import { hexToRgba, getStatusModifier, getNodeSize } from './helpers';

const DEBUG_GRAPH = false;
function debugLog(_section: string, _message: string, _data?: unknown): void {
  if (!DEBUG_GRAPH) return;
}

// ============================================================================
// TYPES
// ============================================================================

export interface GraphCallbacks {
  onNodeClick?: (node: TechNode, index: number) => void;
  onNodeHover?: (node: TechNode | null, index: number | null) => void;
  onBackgroundClick?: () => void;
  onSimulationEnd?: () => void;
}

export interface GraphState {
  selectedNodeIndex: number | null;
  hoveredNodeIndex: number | null;
  highlightedIndices: number[];
}

// ============================================================================
// COSMOS GRAPH WRAPPER
// ============================================================================

const SNAP_BACK_DURATION_MS = 350;
const SNAP_BACK_EASING = (t: number) => 1 - Math.pow(1 - t, 2); // ease-out quad

export class CosmosGraph {
  private graph: Graph | null = null;
  private container: HTMLDivElement | null = null;
  private techTree: TechTree;
  private callbacks: GraphCallbacks;
  private state: GraphState;
  private nodeIndexToId: Map<number, string>;
  private snapBackRafId: number = 0;

  constructor(techTree: TechTree, callbacks: GraphCallbacks = {}) {
    this.techTree = techTree;
    this.callbacks = callbacks;
    this.state = {
      selectedNodeIndex: null,
      hoveredNodeIndex: null,
      highlightedIndices: [],
    };

    // Create reverse mapping
    this.nodeIndexToId = new Map(
      techTree.nodes.map((node, idx) => [idx, node.id])
    );
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  mount(container: HTMLDivElement): void {
    this.container = container;

    const config: GraphConfigInterface = {
      // No simulation: nodes stay pinned to our tier/domain layout (no link-spring clustering).
      enableSimulation: false,

      // Background
      backgroundColor: '#0a0a1a',

      // Points (nodes) – default color so fallback isn’t white; greyout keeps others visible
      pointDefaultColor: '#8B5CF6',
      pointDefaultSize: 10,
      pointSizeScale: 1,
      scalePointsOnZoom: true,
      pointOpacity: 1,
      pointGreyoutOpacity: 0.65,

      // Links
      renderLinks: true,
      linkDefaultColor: '#ffffff',
      linkOpacity: 0.12,
      linkDefaultWidth: 1,
      linkArrows: false,
      curvedLinks: true,
      curvedLinkSegments: 8,

      // Unused when enableSimulation: false; kept for reference if re-enabled.
      simulationGravity: 0,
      simulationCenter: 0,
      simulationRepulsion: 0,
      simulationLinkSpring: 0,
      simulationLinkDistance: 0,
      simulationFriction: 0.9,
      simulationDecay: 0,

      // View – fill viewport and keep interaction on
      fitViewOnInit: true,
      fitViewDelay: 400,
      fitViewPadding: 0.15,
      enableZoom: true,
      enableDrag: true,

      // Hover effects – focused ring bright so selection is obvious
      renderHoveredPointRing: true,
      hoveredPointRingColor: 'rgba(255,255,255,0.8)',
      focusedPointRingColor: '#ffffff',

      // Events
      onClick: this.handleClick.bind(this),
      onPointMouseOver: this.handleNodeHover.bind(this),
      onPointMouseOut: this.handleNodeHoverOut.bind(this),
      onBackgroundClick: this.handleBackgroundClick.bind(this),
      onSimulationEnd: this.handleSimulationEnd.bind(this),
      onDragEnd: this.handleDragEnd.bind(this),
    };

    debugLog('mount', 'Creating Graph with config', {
      enableSimulation: config.enableSimulation,
      rescalePositions: config.rescalePositions,
      fitViewOnInit: config.fitViewOnInit,
      fitViewDelay: config.fitViewDelay,
    });

    this.graph = new Graph(container, config);

    debugLog('mount', 'Graph instance created, calling setGraphData()');
    this.setGraphData();
  }

  // ==========================================================================
  // DATA SETUP
  // ==========================================================================

  private setGraphData(): void {
    if (!this.graph) return;

    const { nodes, links } = this.techTree;

    debugLog('setGraphData', 'Input', { nodeCount: nodes.length, linkCount: links.length });

    // Generate positions (clustered by domain)
    const positions = this.generatePositions(nodes);

    // Log what WE are sending: first 3 points + bounds
    const posArr = Array.from(positions);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < posArr.length; i += 2) {
      const x = posArr[i], y = posArr[i + 1];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    const sampleOur = [
      { i: 0, id: nodes[0]?.id, x: posArr[0], y: posArr[1] },
      { i: 1, id: nodes[1]?.id, x: posArr[2], y: posArr[3] },
      { i: 2, id: nodes[2]?.id, x: posArr[4], y: posArr[5] },
    ];
    debugLog('setGraphData', 'Our generated positions (sample + bounds)', {
      sample: sampleOur,
      bounds: { minX, maxX, minY, maxY },
    });

    this.graph.setPointPositions(positions, true); // dontRescale: true

    // Set colors based on domain
    const colors = this.generateColors(nodes);
    this.graph.setPointColors(colors);

    // Set sizes based on importance
    const sizes = this.generateSizes(nodes);
    this.graph.setPointSizes(sizes);

    // Set links
    const linkData = this.generateLinks(links);
    this.graph.setLinks(linkData);

    const linkColors = this.generateLinkColors(links);
    this.graph.setLinkColors(linkColors);

    this.graph.render();

    // Read back what the library actually has (right after render)
    const readback = this.graph.getPointPositions();
    const sampleReadback = readback.length >= 6
      ? [
          { i: 0, x: readback[0], y: readback[1] },
          { i: 1, x: readback[2], y: readback[3] },
          { i: 2, x: readback[4], y: readback[5] },
        ]
      : [];
    const same = sampleOur.every((s, i) => {
      const r = sampleReadback[i];
      return r && Math.abs(s.x - r.x) < 1e-5 && Math.abs(s.y - r.y) < 1e-5;
    });
    debugLog('setGraphData', 'After render(): getPointPositions() readback (sample)', {
      sample: sampleReadback,
      sameAsOurs: same,
      readbackLength: readback.length,
    });

    // Delayed checks: do positions change over time?
    const scheduleReadback = (label: string, delayMs: number) => {
      setTimeout(() => {
        if (!this.graph) return;
        const later = this.graph.getPointPositions();
        if (later.length >= 6) {
          const sample = [
            { i: 0, x: later[0], y: later[1] },
            { i: 1, x: later[2], y: later[3] },
            { i: 2, x: later[4], y: later[5] },
          ];
          const stillSame = sampleOur.every((s, i) => {
            const r = sample[i];
            return r && Math.abs(s.x - r.x) < 1e-5 && Math.abs(s.y - r.y) < 1e-5;
          });
          debugLog('setGraphData', `${label} (${delayMs}ms later) getPointPositions()`, {
            sample,
            stillSameAsInitial: stillSame,
          });
        }
      }, delayMs);
    };
    scheduleReadback('Delayed readback 1', 1000);
    scheduleReadback('Delayed readback 2', 3000);
  }

  private generatePositions(nodes: TechNode[]): Float32Array {
    const positions: number[] = [];

    if (LAYOUT_MODE === 'tierTrl') {
      // X = TRL (1–9), Y = Tier (0–5). Group by (tier, trl) and spread within each cell to avoid bunching.
      const key = (tier: number, trl: number) => `${tier},${trl}`;
      const cellIndices: Record<string, number> = {};
      nodes.forEach((node) => {
        const trl = getNodeTRL(node);
        const t = node.tier;
        const k = key(t, trl);
        cellIndices[k] = (cellIndices[k] ?? 0) + 1;
      });
      const cellCounts: Record<string, number> = {};
      nodes.forEach((node) => {
        const trl = getNodeTRL(node);
        const tier = node.tier;
        const k = key(tier, trl);
        const idx = cellCounts[k] ?? 0;
        cellCounts[k] = idx + 1;
        const totalInCell = cellIndices[k];
        const step = LAYOUT_CELL_SPREAD;
        const cols = Math.max(1, Math.ceil(Math.sqrt(totalInCell)));
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const offsetX = (col - (cols - 1) / 2) * step;
        const offsetY = (row - (Math.ceil(totalInCell / cols) - 1) / 2) * step;
        const x = (trl - 1) * LAYOUT_TRL_SCALE + offsetX;
        const y = tier * LAYOUT_TIER_SCALE + offsetY;
        positions.push(x, y);
      });
      return new Float32Array(positions);
    }

    // Domain rings layout
    const domainTierIndices: Record<string, number> = {};
    const domainTierCounts: Record<string, Record<number, number>> = {};

    nodes.forEach((node) => {
      const t = node.tier;
      if (!domainTierCounts[node.domain]) domainTierCounts[node.domain] = {};
      domainTierCounts[node.domain][t] = (domainTierCounts[node.domain][t] || 0) + 1;
    });

    nodes.forEach((node) => {
      const domain = DOMAINS[node.domain];
      const baseX = domain.position?.[0] ?? 0;
      const baseY = domain.position?.[1] ?? 0;

      const tier = node.tier;
      const tierKey = `${node.domain}-${tier}`;
      const indexInTier = domainTierIndices[tierKey] ?? 0;
      domainTierIndices[tierKey] = indexInTier + 1;

      const tierCount = domainTierCounts[node.domain]?.[tier] ?? 1;
      const spread = LAYOUT_SPREAD_BASE + tier * LAYOUT_SPREAD_PER_TIER;
      const radius = spread * Math.pow(LAYOUT_TIER_RING_SCALE, tier) * Math.sqrt(indexInTier + 1);
      const angle = (indexInTier / Math.max(1, tierCount)) * 2 * Math.PI + (tier * 0.5);

      const x = baseX + Math.cos(angle) * radius;
      const y = baseY + Math.sin(angle) * radius;

      positions.push(x, y);
    });

    return new Float32Array(positions);
  }

  private generateColors(nodes: TechNode[]): Float32Array {
    const colors: number[] = [];
    const nodeWithVisible = nodes as (TechNode & { visible?: boolean })[];

    nodes.forEach((node, i) => {
      if (nodeWithVisible[i]?.visible === false) {
        colors.push(0, 0, 0, 0);
        return;
      }
      const domain = DOMAINS[node.domain];
      if (!domain) {
        colors.push(255, 0, 0, 1);
        return;
      }

      const [r, g, b] = hexToRgba(domain.color);
      const modifier = getStatusModifier(node.status);

      colors.push(
        Math.round(r * modifier),
        Math.round(g * modifier),
        Math.round(b * modifier),
        1
      );
    });

    return new Float32Array(colors);
  }

  private generateSizes(nodes: TechNode[]): Float32Array {
    const nodeWithVisible = nodes as (TechNode & { visible?: boolean })[];
    const sizes = nodes.map((node, i) =>
      nodeWithVisible[i]?.visible === false ? 0 : getNodeSize(node, true)
    );
    return new Float32Array(sizes);
  }

  private generateLinks(links: typeof this.techTree.links): Float32Array {
    const linkData: number[] = [];

    links.forEach(link => {
      const sourceIndex = NODE_INDEX_MAP.get(link.source);
      const targetIndex = NODE_INDEX_MAP.get(link.target);

      if (sourceIndex !== undefined && targetIndex !== undefined) {
        linkData.push(sourceIndex, targetIndex);
      }
    });

    return new Float32Array(linkData);
  }

  private generateLinkColors(links: typeof this.techTree.links): Float32Array {
    const colors: number[] = [];
    const nodesWithVisible = this.techTree.nodes as (TechNode & { visible?: boolean })[];

    links.forEach(link => {
      const sourceNode = this.techTree.nodes.find(n => n.id === link.source);
      const targetNode = this.techTree.nodes.find(n => n.id === link.target);
      const sourceVisible = sourceNode && (nodesWithVisible[this.techTree.nodes.indexOf(sourceNode)]?.visible !== false);
      const targetVisible = targetNode && (nodesWithVisible[this.techTree.nodes.indexOf(targetNode)]?.visible !== false);
      if (!sourceVisible || !targetVisible) {
        colors.push(0, 0, 0, 0);
        return;
      }
      if (sourceNode) {
        const domain = DOMAINS[sourceNode.domain];
        const [r, g, b] = hexToRgba(domain.color);
        const alpha = link.type === 'dependency' ? 0.3 : 0.15;
        colors.push(r, g, b, alpha);
      } else {
        colors.push(100, 100, 100, 0.2);
      }
    });

    return new Float32Array(colors);
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  private handleClick(index: number | undefined, _position: [number, number] | undefined, _event: MouseEvent): void {
    debugLog('events', 'handleClick', { index, position: _position });
    if (index === undefined) return;

    const nodeId = this.nodeIndexToId.get(index);
    if (!nodeId) return;

    const node = this.techTree.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.state.selectedNodeIndex = index;
    this.highlightNode(index);

    this.callbacks.onNodeClick?.(node, index);
  }

  private handleNodeHover(index: number, _position: [number, number], _event: any): void {
    const nodeId = this.nodeIndexToId.get(index);
    if (!nodeId) return;

    const node = this.techTree.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.state.hoveredNodeIndex = index;
    debugLog('events', 'handleNodeHover', { index, nodeId: node.id, name: node.name });
    this.callbacks.onNodeHover?.(node, index);
  }

  private handleNodeHoverOut(_event: any): void {
    debugLog('events', 'handleNodeHoverOut');
    this.state.hoveredNodeIndex = null;
    this.callbacks.onNodeHover?.(null, null);
  }

  private handleBackgroundClick(): void {
    debugLog('events', 'handleBackgroundClick');
    this.state.selectedNodeIndex = null;
    this.clearHighlight();
    this.callbacks.onBackgroundClick?.();
  }

  private handleSimulationEnd(): void {
    debugLog('events', 'handleSimulationEnd (simulation finished or ticked)');
    this.callbacks.onSimulationEnd?.();
  }

  private handleDragEnd(): void {
    if (!this.graph) return;
    const current = this.graph.getPointPositions();
    const target = this.generatePositions(this.techTree.nodes);
    const targetArr = Array.from(target);
    if (current.length !== targetArr.length) return;

    const startTime = performance.now();
    const startPositions = Array.from(current);

    const tick = (): void => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(1, elapsed / SNAP_BACK_DURATION_MS);
      const eased = SNAP_BACK_EASING(t);

      const positions = new Float32Array(startPositions.length);
      for (let i = 0; i < startPositions.length; i++) {
        positions[i] = startPositions[i] + (targetArr[i] - startPositions[i]) * eased;
      }

      this.graph?.setPointPositions(positions, true);
      this.graph?.render();

      if (t < 1) {
        this.snapBackRafId = requestAnimationFrame(tick);
      } else {
        this.snapBackRafId = 0;
      }
    };

    if (this.snapBackRafId) cancelAnimationFrame(this.snapBackRafId);
    this.snapBackRafId = requestAnimationFrame(tick);
  }

  // ==========================================================================
  // INTERACTION METHODS
  // ==========================================================================

  highlightNode(index: number): void {
    if (!this.graph) return;

    // Get adjacent nodes
    const adjacentIndices = this.graph.getAdjacentIndices(index) || [];
    this.state.highlightedIndices = [index, ...adjacentIndices];

    this.graph.selectPointByIndex(index, true);
    this.graph.setConfig({ focusedPointIndex: index });
  }

  clearHighlight(): void {
    if (!this.graph) return;

    this.state.highlightedIndices = [];
    this.graph.unselectPoints();
    this.graph.setConfig({ focusedPointIndex: undefined });
  }

  zoomToNode(nodeId: string, duration = 700): void {
    if (!this.graph) return;

    const index = NODE_INDEX_MAP.get(nodeId);
    if (index !== undefined) {
      this.graph.zoomToPointByIndex(index, duration, 4);
      this.graph.selectPointByIndex(index, true);
      this.graph.setConfig({ focusedPointIndex: index });
      this.state.selectedNodeIndex = index;
    }
  }

  zoomToDomain(domainId: DomainId, duration = 500): void {
    if (!this.graph) return;

    const domainNodeIndices = this.techTree.nodes
      .map((node, idx) => node.domain === domainId ? idx : -1)
      .filter(idx => idx !== -1);

    if (domainNodeIndices.length > 0) {
      this.graph.fitViewByPointIndices(domainNodeIndices, duration, 0.2);
    }
  }

  fitView(duration = 300): void {
    if (!this.graph) return;
    this.graph.fitView(duration, 0.1);
  }

  setZoom(level: number, duration = 300): void {
    if (!this.graph) return;
    this.graph.setZoomLevel(level, duration);
  }

  // ==========================================================================
  // FILTERING
  // ==========================================================================

  filterByDomains(domainIds: DomainId[]): void {
    if (!this.graph) return;

    debugLog('filterByDomains', 'called', {
      domainIds,
      activeCount: domainIds.length === 0 ? 'all' : domainIds.length,
    });

    const nodes = this.techTree.nodes;
    const colors = new Float32Array(nodes.length * 4);
    const sizes = new Float32Array(nodes.length);

    nodes.forEach((node, idx) => {
      const domain = DOMAINS[node.domain];
      const [r, g, b] = hexToRgba(domain?.color ?? '#888');
      const isActive = domainIds.length === 0 || domainIds.includes(node.domain);
      const modifier = isActive ? getStatusModifier(node.status) : 0.15;
      const alpha = isActive ? 1 : 0.1;

      const base = idx * 4;
      colors[base] = Math.round(r * modifier);
      colors[base + 1] = Math.round(g * modifier);
      colors[base + 2] = Math.round(b * modifier);
      colors[base + 3] = alpha;

      sizes[idx] = getNodeSize(node, isActive);
    });

    this.graph.setPointColors(colors);
    this.graph.setPointSizes(sizes);
    this.graph.render();

    const after = this.graph.getPointPositions();
    if (after.length >= 6) {
      debugLog('filterByDomains', 'after render(): first point position (should be unchanged)', {
        x: after[0], y: after[1],
      });
    }
  }

  /**
   * Update the tech tree (e.g. when timeline year changes) without remounting.
   * Reapplies positions, colors, sizes, and links from the new tree.
   */
  setTechTree(techTree: TechTree): void {
    this.techTree = techTree;
    this.setGraphData();
    this.graph?.render();
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  destroy(): void {
    debugLog('lifecycle', 'destroy() called');
    if (this.snapBackRafId) {
      cancelAnimationFrame(this.snapBackRafId);
      this.snapBackRafId = 0;
    }
    if (this.graph) {
      this.graph.destroy();
      this.graph = null;
    }
    this.container = null;
  }

  // ==========================================================================
  // GETTERS
  // ==========================================================================

  getGraph(): Graph | null {
    return this.graph;
  }

  getState(): GraphState {
    return { ...this.state };
  }

  /** Returns current node positions in canvas pixel coordinates for label overlay. */
  getNodeScreenPositions(): { node: TechNode; x: number; y: number }[] {
    if (!this.graph || !this.techTree) return [];
    const positions = this.graph.getPointPositions();
    const out: { node: TechNode; x: number; y: number }[] = [];
    const nodes = this.techTree.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const x = positions[i * 2];
      const y = positions[i * 2 + 1];
      const screen = this.graph.spaceToScreenPosition([x, y]);
      out.push({ node: nodes[i], x: screen[0], y: screen[1] });
    }
    return out;
  }
}

export default CosmosGraph;
