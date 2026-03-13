import { Domain, DomainId } from '../types';

/**
 * Domain definitions with colors optimized for dark backgrounds
 * Colors are chosen to be visually distinct and vibrant
 */
export const DOMAINS: Record<DomainId, Domain> = {
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Machine learning, neural networks, and the path to AGI',
    color: '#8B5CF6',  // Purple
    position: [0, 0],
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    description: 'Fusion, renewables, and next-gen power systems',
    color: '#F59E0B',  // Amber
    position: [800, -400],
  },
  biotech: {
    id: 'biotech',
    name: 'Biotechnology',
    description: 'Gene editing, longevity, synthetic biology',
    color: '#10B981',  // Emerald
    position: [-800, -400],
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum',
    description: 'Quantum computing, sensing, and communication',
    color: '#06B6D4',  // Cyan
    position: [400, 600],
  },
  nanotech: {
    id: 'nanotech',
    name: 'Nanotechnology',
    description: 'Molecular manufacturing, metamaterials',
    color: '#EC4899',  // Pink
    position: [-400, 600],
  },
  space: {
    id: 'space',
    name: 'Space',
    description: 'Colonization, asteroid mining, propulsion',
    color: '#3B82F6',  // Blue
    position: [1000, 200],
  },
  neurotech: {
    id: 'neurotech',
    name: 'Neurotechnology',
    description: 'BCIs, brain mapping, neural interfaces',
    color: '#EF4444',  // Red
    position: [-1000, 200],
  },
  robotics: {
    id: 'robotics',
    name: 'Robotics',
    description: 'Humanoids, automation, embodied AI',
    color: '#F97316',  // Orange
    position: [600, -600],
  },
  compute: {
    id: 'compute',
    name: 'Compute',
    description: 'Chips, architectures, and raw processing power',
    color: '#6366F1',  // Indigo
    position: [-600, -600],
  },
};

export const DOMAIN_LIST = Object.values(DOMAINS);

/**
 * Get domain by ID with type safety
 */
export function getDomain(id: DomainId): Domain {
  return DOMAINS[id];
}

/**
 * Get domain color by ID (fallback for unknown ids)
 */
export function getDomainColor(id: DomainId | string): string {
  return DOMAINS[id as DomainId]?.color ?? '#888';
}
