# Timeline Slider – Design

## Goal

A timeline slider (default: present / 2026) so users can see technologies move through TRL levels over time based on milestones.

## Requirements

- **Modular**: Timeline logic is data-only; graph receives a "tree at year" and stays dumb.
- **Same node count**: We never add/remove nodes (Cosmos expects fixed indices). Nodes "not yet visible" at year T are styled as invisible (opacity 0, size 0).
- **TRL at date**: Derived from milestones (breakthrough → +2, major → +1, minor → +0.5) and capped by node’s current TRL; if `yearAchieved <= year` use current TRL.

## Data Layer (`src/utils/timeline.ts`)

- **`getNodeStateAtDate(node, dateStr)`**  
  Returns `{ visible: boolean, trl: TRL, status: NodeStatus }`:
  - **visible**: `yearAchieved <= year` OR at least one milestone on or before `dateStr`.
  - **trl**: If achieved by that year → node’s TRL; else accumulate milestone significance (breakthrough +2, major +1, minor +0.5) from milestones ≤ date, cap at node’s TRL.
  - **status**: If achieved by year → `'achieved'`; else if any milestone before year → `'in_progress'`; else keep node’s status.

- **`getTechTreeAtYear(techTree, year)`**  
  Returns a new `TechTree` with the same nodes and links. Each node is extended with:
  - `visible`: from `getNodeStateAtDate`
  - `trl` / `status`: overridden to the value at that date (so graph colors/sizes reflect TRL/status at time).

- **`getTimelineBounds(nodes)`**  
  Returns `{ minYear, maxYear }` from earliest milestone/yearAchieved to present (e.g. 2026) or latest yearEstimated.

No UI in this module; pure functions only.

## Graph Layer

- **CosmosGraph**  
  - In `generateColors` / `generateSizes`: if `(node as any).visible === false`, use opacity 0 and size 0 (so "not yet" nodes don’t show).
  - Add **`setTechTree(techTree: TechTree)`** that updates `this.techTree` and calls `setGraphData()` so the graph can update without remounting.

- **useTechGraph**  
  - Keep a single mount of the graph.
  - When `techTree` reference changes, call `graphRef.current?.setTechTree(techTree)` instead of destroying/remounting.

## UI

- **TimelineSlider**  
  - Props: `min`, `max`, `value` (year), `onChange(year)`.
  - Default `value`: 2026 (present).
  - Place above or beside the graph (e.g. in header/toolbar).

- **App**  
  - State: `timelineYear` (default 2026).
  - `techTreeAtYear = useMemo(() => getTechTreeAtYear(TECH_TREE, timelineYear), [timelineYear])`.
  - Pass `techTreeAtYear` into `useTechGraph`.
  - Render `TimelineSlider` with `getTimelineBounds(TECH_TREE.nodes)`, `value={timelineYear}`, `onChange={setTimelineYear}`.

## Link visibility

Links stay as-is; both endpoints may be visible or not. Optionally dim/hide links when either endpoint is not visible (same as node: use opacity 0 for link when source or target has `visible === false`).

## File layout

- `src/utils/timeline.ts` – getNodeStateAtDate, getTechTreeAtYear, getTimelineBounds
- `src/components/TechTree/TimelineSlider.tsx` – slider UI
- `src/graph/CosmosGraph.ts` – visible handling + setTechTree
- `src/hooks/useTechGraph.ts` – update effect for techTree
- `src/App.tsx` – timeline state + techTreeAtYear + slider
