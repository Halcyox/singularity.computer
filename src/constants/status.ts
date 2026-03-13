import type { NodeStatus } from '../types';

/** Display order for status in UI */
export const STATUS_ORDER: NodeStatus[] = [
  'achieved',
  'in_progress',
  'theoretical',
  'speculative',
];

export const STATUS_LABELS: Record<NodeStatus, string> = {
  achieved: 'Achieved',
  in_progress: 'In progress',
  theoretical: 'Theoretical',
  speculative: 'Speculative',
};

export const STATUS_COLORS: Record<NodeStatus, string> = {
  achieved: '#10B981',
  in_progress: '#F59E0B',
  theoretical: '#6366F1',
  speculative: '#6B7280',
};
