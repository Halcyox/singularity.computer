# Options for higher-quality tech tree visualization

The main issues today: **label overlap** in dense regions (TRL 4–7, Tier 2–4), **readability**, and **overall polish**. Below are options grouped by impact and effort.

---

## 1. Label overlap (biggest win)

### A. Show fewer labels by default

**Idea:** Don’t render a label for every node at once. Reduce clutter so what’s shown is readable.

| Option | How | Pros | Cons |
|--------|-----|------|------|
| **Labels on hover only** | Show label only for the hovered node (tooltip already exists; could be a persistent label near cursor). | No overlap; trivial to implement. | Names not scannable at a glance. |
| **Labels at zoom** | Show labels only when zoomed in past a threshold (e.g. zoom level &gt; 1.5 or view contains &lt; 40 nodes). | Dense view = dots only; zoom in = names appear. | Need zoom level or visible-node count (Cosmos may not expose zoom). |
| **Priority labels** | Show labels only for “important” nodes (e.g. importance ≥ 7, or achieved/in progress). Rest on hover. | Balances scanability and clutter. | Need a clear rule for “important.” |
| **Limit visible labels** | Cap at N labels (e.g. 40), chosen by importance or by distance from view center. | Bounded clutter. | Arbitrary; some nodes never get a label. |

**Recommendation:** **Priority labels** (e.g. show label if `importance >= 7` or `status === 'achieved' | 'in_progress'`) plus **tooltip on hover for all**. Quick to implement and greatly reduces overlap.

---

### B. Reposition labels to avoid overlap

**Idea:** Keep “label per node” but move labels so they don’t (or rarely) overlap.

| Option | How | Pros | Cons |
|--------|-----|------|------|
| **Greedy layout** | Place labels in order (e.g. by importance); for each, pick among 4–8 candidate positions (N/S/E/W, etc.) the one that overlaps least with already-placed labels. | Predictable, fast, no extra deps if you implement a simple variant. | Some labels may be far from their point; need bounding-box collision. |
| **d3fc-label-layout** | Use [d3fc-label-layout](https://github.com/ColinEberhardt/d3fc-label-layout) (greedy or simulated annealing) to assign positions. | Battle-tested, good results. | Extra dependency; may need D3; run on position updates / zoom. |
| **Force-directed labels** | Run a small simulation that repels overlapping labels (e.g. d3.forceCollide on label centers). | Can look organic. | Heavier, iterative; need to re-run on zoom/pan. |

**Recommendation:** Start with a **simple greedy** pass: for each label (sorted by importance desc), try 4–8 offsets (e.g. above, below, left, right, diagonals), measure overlap with already-placed label rects, choose the position with smallest overlap. Re-run when positions or view change. If that’s not enough, consider d3fc-label-layout.

---

### C. Aggregate / cluster in dense regions

**Idea:** In dense areas, don’t show every name; show a summary.

| Option | How | Pros | Cons |
|--------|-----|------|------|
| **Cluster bubbles** | At low zoom, group nodes in the same (Tier, TRL) cell (or nearby) into one “bubble” with count, e.g. “5 technologies.” Click or zoom to expand. | No overlap; clear “there’s more here.” | Requires zoom/aggregation model and interaction design. |
| **Leader lines** | Draw a short line from node to label; labels can be placed in a margin or in a grid to the side. | Separates points from text; can sort labels. | Visual noise; needs layout logic and possibly interaction. |

**Recommendation:** Cluster bubbles are powerful but more work (zoom levels, aggregation, expand interaction). Save for a later phase; first fix overlap with “fewer labels” or “reposition labels.”

---

## 2. Visual polish

### A. Typography and hierarchy

- **Font:** Use a clear sans (e.g. Inter, DM Sans) with distinct **weight** for node names (e.g. 600) and secondary text (400).
- **Size:** Slightly smaller default label font (e.g. 10px) so more labels fit; rely on tooltip for full name if truncated.
- **Domain:** Make domain more visible: e.g. **dot color = domain** (already in data), and a thin **domain-colored ring** around the node (if the graph lib supports it) so the dot isn’t “just white.”

### B. Density-aware styling

- **Opacity or fade:** In very dense regions, slightly reduce label opacity or show only the dot until hover.
- **Contrast:** Ensure label background (e.g. dark pill) has enough contrast and a subtle border so it’s readable on grid and links.

### C. Grid and axes

- **Grid:** You already have an adaptive Tier/TRL grid; keep it subtle (e.g. 0.08–0.12 opacity) so it doesn’t compete with nodes/labels.
- **Axis labels:** Slightly larger, semibold; “Tier” and “TRL” plus units (0–5, 1–9) so the chart reads as “high quality” at a glance.

---

## 3. Interaction

- **Tooltip:** You have it; ensure it shows **name, domain, status, TRL** and appears quickly on hover.
- **Zoom to reveal:** If you add “labels at zoom,” make it obvious (e.g. short hint: “Zoom in to see names”).
- **Click:** Keep “click → detail panel” and consider “focus mode”: on click, dim or fade non-selected nodes so the selection and its neighborhood stand out.

---

## 4. Technical notes

- **Collision:** For greedy label layout you need **axis-aligned bounding boxes** for each label (position + measured or estimated width/height). Use `getBoundingClientRect()` or a fixed width (e.g. `ch` × character count) for speed.
- **When to run layout:** On graph data change, and when the view changes (pan/zoom). If the engine doesn’t expose zoom, run layout on a timer (e.g. every 300–500 ms) while the user is panning/zooming, or only on pointer up.
- **Performance:** With ~118 nodes, a simple O(N²) overlap check per candidate position is fine. For 1000+ nodes, use spatial indexing (e.g. grid or R-tree) for overlap checks.

---

## 5. Suggested order of work

| Priority | What | Why |
|----------|------|-----|
| 1 | **Fewer labels by default** (e.g. importance ≥ 7 or status achieved/in progress) + tooltip for all | Removes most overlap with minimal code; immediate readability gain. |
| 2 | **Simple greedy label placement** for the labels you do show (try 4–8 positions, pick least overlap) | Keeps “label per node” for important techs without stacking. |
| 3 | **Visual polish** (font, label size, domain on node/ring) | Makes the viz feel intentional and readable. |
| 4 | **Zoom- or density-based label visibility** (if you get zoom or visible-node count) | Dense view = dots; zoomed in = names. |
| 5 | **Cluster bubbles** in dense cells | Best long-term for scale; do after 1–3. |

Starting with **priority labels + tooltip** and then adding **greedy label placement** for those labels will get you most of the way to “high quality” without changing the graph engine or adding heavy dependencies.
