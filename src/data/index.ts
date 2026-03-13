import { TechTree, TechNode, TechLink, DomainId } from '../types';
import { DOMAIN_LIST } from './domains';

// Import all domain nodes
import AI_NODES from './domains/ai';
import ENERGY_NODES from './domains/energy';
import QUANTUM_NODES from './domains/quantum';
import BIOTECH_NODES from './domains/biotech';
import NEUROTECH_NODES from './domains/neurotech';
import ROBOTICS_NODES from './domains/robotics';
import SPACE_NODES from './domains/space';
import NANOTECH_NODES from './domains/nanotech';
import COMPUTE_NODES from './domains/compute';

// ============================================================================
// COMBINE ALL NODES
// ============================================================================

export const ALL_NODES: TechNode[] = [
  ...AI_NODES,
  ...ENERGY_NODES,
  ...QUANTUM_NODES,
  ...BIOTECH_NODES,
  ...NEUROTECH_NODES,
  ...ROBOTICS_NODES,
  ...SPACE_NODES,
  ...NANOTECH_NODES,
  ...COMPUTE_NODES,
];

// Create a map for quick lookups
export const NODE_MAP = new Map<string, TechNode>(
  ALL_NODES.map(node => [node.id, node])
);

// ============================================================================
// GENERATE LINKS FROM DEPENDENCIES
// ============================================================================

function generateLinks(): TechLink[] {
  const links: TechLink[] = [];

  for (const node of ALL_NODES) {
    if (node.dependencies) {
      for (const depId of node.dependencies) {
        if (NODE_MAP.has(depId)) {
          links.push({
            source: depId,
            target: node.id,
            type: 'dependency',
            strength: 1,
          });
        }
      }
    }
  }

  return links;
}

export const ALL_LINKS = generateLinks();

// ============================================================================
// CROSS-DOMAIN LINKS
// ============================================================================

// Add some important cross-domain connections
const CROSS_DOMAIN_LINKS: TechLink[] = [
  // AI + Compute
  { source: 'compute-ai-accelerators', target: 'ai-gpt4', type: 'enables', strength: 0.8 },
  { source: 'compute-hbm', target: 'ai-gpt4', type: 'enables', strength: 0.6 },

  // AI + Robotics
  { source: 'ai-multimodal', target: 'robotics-humanoid-commercial', type: 'enables', strength: 0.8 },
  { source: 'ai-agents', target: 'robotics-humanoid-commercial', type: 'enables', strength: 0.7 },

  // AI + Neurotech
  { source: 'ai-neural-networks', target: 'neuro-thought-to-text', type: 'enables', strength: 0.6 },

  // Quantum + AI
  { source: 'quantum-ftqc', target: 'ai-agi', type: 'related', strength: 0.5 },

  // Quantum + Compute
  { source: 'quantum-logical-qubit', target: 'compute-molecular', type: 'related', strength: 0.4 },

  // Biotech + Nanotech
  { source: 'nano-drug-delivery', target: 'biotech-gene-therapy', type: 'enables', strength: 0.7 },
  { source: 'nano-nanobots-medical', target: 'biotech-longevity-escape', type: 'related', strength: 0.5 },

  // Energy + Space
  { source: 'energy-fusion-commercial', target: 'space-mars-colony', type: 'enables', strength: 0.6 },

  // Compute + Quantum
  { source: 'compute-photonic', target: 'quantum-ftqc', type: 'related', strength: 0.4 },

  // AI + Biotech
  { source: 'ai-gpt4', target: 'biotech-synthetic-biology', type: 'enables', strength: 0.5 },

  // Nanotech + Compute
  { source: 'nano-carbon-nanotubes', target: 'compute-carbon-nanotube', type: 'enables', strength: 0.9 },
];

// ============================================================================
// COMPLETE TECH TREE
// ============================================================================

export const TECH_TREE: TechTree = {
  domains: DOMAIN_LIST,
  nodes: ALL_NODES,
  links: [...ALL_LINKS, ...CROSS_DOMAIN_LINKS],
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalNodes: ALL_NODES.length,
    totalLinks: ALL_LINKS.length + CROSS_DOMAIN_LINKS.length,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all nodes for a specific domain
 */
export function getNodesByDomain(domainId: DomainId): TechNode[] {
  return ALL_NODES.filter(node => node.domain === domainId);
}

/**
 * Get all links involving a specific node
 */
export function getLinksForNode(nodeId: string): TechLink[] {
  return TECH_TREE.links.filter(
    link => link.source === nodeId || link.target === nodeId
  );
}

/**
 * Get adjacent nodes (connected via links)
 */
export function getAdjacentNodes(nodeId: string): TechNode[] {
  const links = getLinksForNode(nodeId);
  const adjacentIds = new Set<string>();

  for (const link of links) {
    if (link.source === nodeId) adjacentIds.add(link.target);
    if (link.target === nodeId) adjacentIds.add(link.source);
  }

  return Array.from(adjacentIds)
    .map(id => NODE_MAP.get(id))
    .filter((node): node is TechNode => node !== undefined);
}

/**
 * Get node index in the array (for Cosmos)
 */
export function getNodeIndex(nodeId: string): number {
  return ALL_NODES.findIndex(node => node.id === nodeId);
}

/**
 * Create node index map for quick lookups
 */
export const NODE_INDEX_MAP = new Map<string, number>(
  ALL_NODES.map((node, index) => [node.id, index])
);

// Re-export domains
export { DOMAINS, DOMAIN_LIST } from './domains';
export type { Domain } from '../types';
