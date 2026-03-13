# Organizing the tech tree: options and TRL

Ways to organize, filter, and group nodes beyond the current **domain** filter.

---

## 1. Technology Readiness Level (TRL)

**What it is:** A standard 1–9 scale for maturity (NASA/DoD style):

| TRL | Stage |
|-----|--------|
| 1–3 | Basic research, concept, experimental proof |
| 4–6 | Validation, prototype, testing in environment |
| 7–9 | System complete, operational, mission-proven |

**In this codebase:**

- **Type:** `TechNode` has optional `trl?: TRL` (1–9).
- **Derivation:** If `trl` is missing, it’s derived from `status` and `tier` in `src/utils/trl.ts`:
  - `achieved` → 9
  - `in_progress` → 5 (tier can nudge up)
  - `theoretical` → 3
  - `speculative` → 1

**UI options:**

- **Filter by TRL band:** e.g. “Show TRL 4–6 only” (validation/prototype).
- **Group by TRL:** Layout or color by TRL band (e.g. rows or rings by TRL 1–3, 4–6, 7–9).
- **Label or tooltip:** Show “TRL 5” on nodes; optionally sort/order by TRL.

---

## 2. Other organization dimensions (already in data)

| Dimension | Field | Current use | Possible additions |
|-----------|--------|-------------|---------------------|
| **Domain** | `domain` | Filter (include set), layout clusters, colors | ✓ in use |
| **Tier** | `tier` | Layout (rings per domain), no filter yet | Filter “Tier 0–2 only”; slider or bands |
| **Status** | `status` | Styling (opacity/size), no filter yet | Filter by achieved / in_progress / theoretical / speculative |
| **Importance** | `importance` | Node size | Sort by importance; “Top N by importance” |
| **Time** | `yearAchieved`, `yearEstimated` | Not used in layout | Timeline filter (e.g. “By 2040”); decade bands |

---

## 3. Suggested UI controls (priority)

1. **TRL filter**  
   - Dropdown or chips: “All”, “TRL 1–3”, “TRL 4–6”, “TRL 7–9”.  
   - Hides nodes (and labels) outside the band; works on top of domain filter.

2. **Status filter**  
   - Multi-select: Achieved, In progress, Theoretical, Speculative.  
   - Same include-set behavior as domains (empty = show all).

3. **Tier range**  
   - “Show tiers 0–2” (foundational + near-term) vs “All tiers”.  
   - Complements TRL (tier is progression within a domain; TRL is maturity).

4. **Layout / “Group by” (later)**  
   - Current: layout by **domain** + **tier** (rings).  
   - Optional: “Group by TRL” (e.g. horizontal bands or concentric rings by TRL band).  
   - Would require a second layout mode in `CosmosGraph.generatePositions()` or a separate view.

---

## 4. Implementation order

- **Phase 1 (minimal):** Use existing `getNodeTRL()` and add a **TRL filter** (e.g. dropdown) that filters nodes and labels by TRL band; optional “TRL” in tooltip/NodeDetail.
- **Phase 2:** Add **status filter** (multi-select) and **tier range** (e.g. 0–2 vs all).
- **Phase 3:** Optional **layout by TRL** (alternate `generatePositions` or view that clusters by TRL band instead of domain).

Defining nodes by TRL is a good idea: add explicit `trl` where you know it, and use the derived TRL for filtering and grouping everywhere else.
