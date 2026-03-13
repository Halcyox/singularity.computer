/**
 * Timeline utilities: derive node visibility and TRL at a given date from milestones.
 * Used by the timeline slider to show "tech tree at year T" without changing the data model.
 */

import type { TechTree, TechNode, TRL, NodeStatus } from '../types';

const PRESENT_YEAR = 2026;

/** Display overrides for a node at a given year (not persisted in domain data). */
export interface NodeStateAtDate {
  visible: boolean;
  trl: TRL;
  status: NodeStatus;
}

/** TRL delta per milestone significance (cumulative before cap). */
const TRL_DELTA: Record<'minor' | 'major' | 'breakthrough', number> = {
  minor: 0.5,
  major: 1,
  breakthrough: 2,
};

/**
 * Returns the effective TRL for a node at a given date from milestones.
 * - If node is achieved by that year, use node's TRL.
 * - Otherwise start at 1 and add deltas from milestones on or before the date; cap at node's TRL.
 */
function trlAtDateFromMilestones(node: TechNode, dateStr: string): TRL {
  const cap = (node.trl ?? 9) as number;
  const year = parseInt(dateStr.slice(0, 4), 10);

  if (node.yearAchieved != null && node.yearAchieved <= year) {
    return (node.trl ?? 9) as TRL;
  }

  const milestones = node.milestones ?? [];
  const onOrBefore = milestones
    .filter((m) => m.date <= dateStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  let value = 1;
  for (const m of onOrBefore) {
    value += TRL_DELTA[m.significance];
  }
  value = Math.min(cap, Math.max(1, Math.round(value)));
  return value as TRL;
}

/**
 * Whether the node has "started" by the given date (visible in timeline).
 * - Achieved by that year, or
 * - At least one milestone on or before that date.
 */
function visibleAtDate(node: TechNode, dateStr: string): boolean {
  const year = parseInt(dateStr.slice(0, 4), 10);
  if (node.yearAchieved != null && node.yearAchieved <= year) return true;
  const milestones = node.milestones ?? [];
  return milestones.some((m) => m.date <= dateStr);
}

/**
 * Status at date: achieved if yearAchieved <= year; in_progress if any milestone before date; else keep node status.
 */
function statusAtDate(node: TechNode, dateStr: string): NodeStatus {
  const year = parseInt(dateStr.slice(0, 4), 10);
  if (node.yearAchieved != null && node.yearAchieved <= year) return 'achieved';
  const milestones = node.milestones ?? [];
  const hasPastMilestone = milestones.some((m) => m.date <= dateStr);
  return hasPastMilestone ? 'in_progress' : node.status;
}

/**
 * Get visibility, TRL, and status for a node at a given ISO date string (e.g. "2020-12-31").
 */
export function getNodeStateAtDate(node: TechNode, dateStr: string): NodeStateAtDate {
  const visible = visibleAtDate(node, dateStr);
  const trl = visible ? trlAtDateFromMilestones(node, dateStr) : (1 as TRL);
  const status = statusAtDate(node, dateStr);
  return { visible, trl, status };
}

/** Node with optional display overrides (used only for rendering at a given year). */
export type TechNodeWithTimelineOverrides = TechNode & {
  visible?: boolean;
  /** Override trl for this year (from timeline). */
  trlAtYear?: TRL;
  /** Override status for this year. */
  statusAtYear?: NodeStatus;
};

/**
 * Returns a tech tree for the given year: same nodes/links, but each node has
 * visible, trl, and status overridden from getNodeStateAtDate.
 * The graph should treat node.visible === false as "invisible" (opacity 0, size 0).
 */
export function getTechTreeAtYear(techTree: TechTree, year: number): TechTree {
  const dateStr = `${year}-12-31`;

  const nodes: TechNodeWithTimelineOverrides[] = techTree.nodes.map((node) => {
    const state = getNodeStateAtDate(node, dateStr);
    return {
      ...node,
      visible: state.visible,
      trlAtYear: state.trl,
      statusAtYear: state.status,
      // So that layout/colors use "at year" values, override trl and status for this view
      trl: state.trl,
      status: state.status,
    };
  });

  return {
    ...techTree,
    nodes,
    links: techTree.links,
    metadata: techTree.metadata,
  };
}

/**
 * Min/max years for the timeline slider from node milestones and yearAchieved/yearEstimated.
 */
export function getTimelineBounds(nodes: TechNode[]): { minYear: number; maxYear: number } {
  let minYear = PRESENT_YEAR;
  let maxYear = PRESENT_YEAR;

  for (const node of nodes) {
    if (node.yearAchieved != null) {
      minYear = Math.min(minYear, node.yearAchieved);
      maxYear = Math.max(maxYear, node.yearAchieved);
    }
    if (node.yearEstimated != null) {
      maxYear = Math.max(maxYear, node.yearEstimated);
    }
    for (const m of node.milestones ?? []) {
      const y = parseInt(m.date.slice(0, 4), 10);
      minYear = Math.min(minYear, y);
      maxYear = Math.max(maxYear, y);
    }
  }

  maxYear = Math.max(maxYear, PRESENT_YEAR);
  minYear = Math.max(1950, minYear); // sensible lower bound

  return { minYear, maxYear };
}

export { PRESENT_YEAR };
