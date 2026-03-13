/**
 * Core type definitions for the Singularity Tech Tree
 */

// ============================================================================
// DOMAIN & NODE TYPES
// ============================================================================

/**
 * Technology domains - major branches of the singularity tech tree
 */
export type DomainId =
  | 'ai'
  | 'energy'
  | 'biotech'
  | 'quantum'
  | 'nanotech'
  | 'space'
  | 'neurotech'
  | 'robotics'
  | 'compute';

/**
 * Status of a technology node
 */
export type NodeStatus =
  | 'achieved'      // Already accomplished
  | 'in_progress'   // Currently being developed
  | 'theoretical'   // Scientifically possible but not started
  | 'speculative';  // Hypothetical, may not be possible

/**
 * Technology Readiness Level (1–9). Standard scale for maturity.
 * 1–3: research/concept, 4–6: validation/prototype, 7–9: system/operational/proven.
 */
export type TRL = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * A technology node in the tree
 */
export interface TechNode {
  id: string;
  name: string;
  description: string;
  domain: DomainId;
  status: NodeStatus;

  // Progress tracking
  progress?: number;           // 0-100 percentage
  progressMetric?: string;     // e.g., "MMLU Score", "Qubit Count"
  progressValue?: string;      // e.g., "89.8%", "1000 qubits"

  // Relationships
  dependencies?: string[];     // IDs of prerequisite nodes
  children?: string[];         // IDs of nodes this unlocks

  // Timeline
  yearAchieved?: number;       // If achieved, when
  yearEstimated?: number;      // If not achieved, estimated year

  // Importance & visibility
  importance: number;          // 1-10, affects node size
  tier: number;                // 0 = foundational, higher = more advanced
  trl?: TRL;                   // Technology Readiness Level 1–9; derived from status/tier if omitted

  // Rich data
  keyPlayers?: string[];       // Companies, labs, researchers
  milestones?: Milestone[];    // Key events
  sources?: Source[];          // Citations

  // Visual
  position?: [number, number]; // Optional fixed position
  cluster?: number;            // Cluster ID for grouping
}

/**
 * A milestone event for a technology
 */
export interface Milestone {
  date: string;                // ISO date string
  title: string;
  description: string;
  source?: string;             // URL
  significance: 'minor' | 'major' | 'breakthrough';
}

/**
 * A source/citation
 */
export interface Source {
  title: string;
  url: string;
  date?: string;
  type: 'paper' | 'news' | 'announcement' | 'documentation';
}

/**
 * Domain metadata
 */
export interface Domain {
  id: DomainId;
  name: string;
  description: string;
  color: string;               // Hex color for the domain
  icon?: string;               // Icon identifier
  position?: [number, number]; // Cluster center position
}

// ============================================================================
// GRAPH TYPES
// ============================================================================

/**
 * A link between two nodes
 */
export interface TechLink {
  source: string;              // Source node ID
  target: string;              // Target node ID
  type: 'dependency' | 'related' | 'enables';
  strength?: number;           // 0-1, affects link rendering
}

/**
 * The complete tech tree data structure
 */
export interface TechTree {
  domains: Domain[];
  nodes: TechNode[];
  links: TechLink[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalNodes: number;
    totalLinks: number;
  };
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Current view/filter state
 */
export interface ViewState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeDomains: DomainId[];
  searchQuery: string;
  zoomLevel: number;
  showLinks: boolean;
  showLabels: boolean;
  filterStatus: NodeStatus[];
}

/**
 * Graph rendering configuration
 */
export interface GraphConfig {
  nodeMinSize: number;
  nodeMaxSize: number;
  linkOpacity: number;
  backgroundColor: string;
  enableSimulation: boolean;
  clusterStrength: number;
}
