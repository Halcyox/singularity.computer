# Deep analysis: Graph libraries for an interactive technological singularity visualization

## 1. What the visualization is for

**singularity.computer** is “tracking humanity’s progress toward the technological singularity.” The graph view is not a generic network: it is a **semantic tech tree** where:

- **Position** should encode **progress and structure**: tier (foundational → advanced), domain (AI, energy, biotech, etc.), and optionally TRL (Technology Readiness Level).
- **Edges** encode **dependencies and relationships** (prerequisite → unlocks).
- **Visual encoding** should support **status** (achieved / in progress / theoretical / speculative), **importance** (node size), and **domain** (color).
- **Interaction** should support exploration (zoom/pan), filtering by domain, selection for detail, and a **readable coordinate frame** (Tier / TRL axes) so “where we are” and “how far along” are interpretable.
- **Dual view**: graph (structure + dependencies) plus embedding view (similarity / alternative geometry) with shared selection and filters.

So the library must support: **custom/preset layout** (your tier/domain rings), **rich overlays** (axes, legend, labels), **viewport-aware scaling**, and **clean integration** with React and a second view (embedding).

---

## 2. Requirements (prioritized for singularity narrative)

### 2.1 Layout and semantics

| Requirement | Why it matters for “singularity progress” |
|-------------|-------------------------------------------|
| **Preset / custom positions** | You already compute (tier, domain) → (x,y). Layout must respect these positions, not overwrite them with force simulation. |
| **Stable positions** | No drift or re-layout on filter; “Tier 4” stays Tier 4 so axes and narrative stay consistent. |
| **Optional force** | Future: e.g. gentle force to reduce overlap while keeping tier/domain structure. Not required today. |

### 2.2 Coordinate frame and storytelling

| Requirement | Why it matters |
|-------------|----------------|
| **Explicit axes (Tier / TRL)** | Viewers should read “vertical = tier”, “horizontal = TRL” (or similar). Requires overlay control and, ideally, sync with zoom/pan. |
| **Viewport-relative or zoom-synced overlays** | Axes and legend should scale or stay readable on resize/zoom so the narrative isn’t “a static box” in the corner. |
| **Minimap or “where am I”** | For 100+ nodes, a minimap helps keep orientation in the tech landscape. |

### 2.3 Interaction and filtering

| Requirement | Why it matters |
|-------------|----------------|
| **Domain filter** | Show only selected domains (e.g. AI + Energy) without re-layout; dim or hide others. |
| **Click → detail panel** | Select a technology and show TRL, progress, dependencies (current NodeDetail). |
| **Hover tooltip** | Quick read of name/domain before clicking. |
| **Zoom/pan** | Explore from “all tech” to “this cluster”; fit view to filtered set. |

### 2.4 Rendering and integration

| Requirement | Why it matters |
|-------------|----------------|
| **Domain-colored nodes and edges** | Status and domain are first-class; need per-node (and ideally per-link) color. |
| **Label overlay** | Node names as HTML/Canvas above nodes, filtered by domain. |
| **React-friendly** | Same app has Graph view + Embedding view + DomainFilter + NodeDetail; refs, state, and overlays must compose. |
| **Zoom/pan API** | For overlay scaling or “fit to selection,” you need access to current zoom/center (Cosmos currently does not expose this). |

### 2.5 Scale and performance

| Requirement | Why it matters |
|-------------|----------------|
| **~100–500 nodes, ~100–500 links** | Current scale; no need for 100k-node GPU heroics. Smooth 60fps and no jank on filter/pan/zoom matter more. |
| **Room to grow** | If the tree grows to 1k+ nodes or you add temporal layers, the stack shouldn’t hit a hard wall. |

---

## 3. Current stack (Cosmos.gl) vs requirements

| Requirement | Cosmos.gl | Gap |
|-------------|-----------|-----|
| Preset positions | ✅ setPointPositions + no simulation | None |
| Stable on filter | ✅ | None |
| Axes / overlay | ⚠️ You build in React; no zoom/scale API | Overlay is “dumb” (no zoom sync), portal/positioning quirks |
| Viewport/zoom sync | ❌ No getZoomLevel / onZoom | Overlays can’t scale with canvas zoom |
| Domain filter | ✅ filterByDomains (colors/sizes) | None |
| Click/hover | ✅ | None |
| Labels | ✅ Your NodeLabelsOverlay | None |
| React | Manual: container ref, callbacks | Works but no first-class React components |
| Minimap | ❌ | You’d build from scratch |
| Bundle / API surface | Small API, closed box | Limited extensibility |

**Verdict:** Cosmos fits “custom positions + links + colors” but is weak for **narrative and orientation**: no zoom/pan API for overlay sync, no built-in minimap or axes, and overlay integration is entirely your responsibility. For a “singularity progress” story, that leaves the experience feeling static and disconnected from the graph.

---

## 4. Library-by-library fit for singularity viz

### 4.1 AntV G6 + Graphin

**Layout:** Many built-in layouts; **preset** layout uses your (x,y) and does not run force. You can feed tier/domain positions directly.

**Overlays / narrative:**  
- **MiniMap** (built-in), **Legend**, **Toolbar** (zoom, fit, etc.).  
- No built-in “axis” widget; you add a custom Tier/TRL axis as a React overlay (same as now) but with **full control** over the DOM and no portal hacks.  
- Graphin components are React-first; overlays and graph share the same tree.

**Interaction:** Selection, hover, click, zoom/pan; **onZoom**-style hooks exist so you can sync overlay scale or labels with viewport. Filtering by domain = update data or styles; G6 supports that.

**React:** **Graphin** is the React wrapper; you get `<Graphin><MiniMap /><YourAxisOverlay /></Graphin>`. Fits dual-view app (graph vs embedding) and shared header/filter/detail.

**Fit for singularity:**  
- ✅ Custom tier/domain layout (preset).  
- ✅ Rich UI (minimap, legend, toolbar) out of the box.  
- ✅ Overlay and zoom API so axes can be “smart” (scale with zoom or viewport).  
- ⚠️ Bundle size and API churn; some docs in Chinese.  
- ⚠️ You still implement Tier/TRL axis yourself, but in a React-friendly way with access to zoom/center.

**Best for:** Product-grade “singularity map” with minimap, legend, and a custom Tier/TRL axis that can scale or stay readable with zoom.

---

### 4.2 react-force-graph (Vasturiano)

**Layout:** Force-directed by default; you can **pin nodes** to (x,y) and optionally run force so only unpinned nodes move, or use **dagre** for hierarchy and pass positions. For “tier rings,” you’d set `node.x/node.y` from your `generatePositions()` and pin them (e.g. `node.fx = node.x; node.fy = node.y`) so the layout is effectively preset.

**Overlays / narrative:**  
- No built-in axes or minimap. You add HTML overlays (axis, legend) as siblings to the canvas.  
- **onZoom** and **onNodeClick** / **onNodeHover** give you zoom state and selection; you can drive overlay scale or labels from zoom.  
- Coordinate conversion (screen ↔ graph) is documented; you can place labels or tooltips correctly.

**Interaction:** Zoom/pan, drag nodes, hover/click; **onZoom** lets you keep Tier/TRL axis in sync with graph zoom (e.g. scale axis or show “current view” range).

**React:** First-class: `react-force-graph` (2D canvas or WebGL). Fits next to EmbeddingView and shared state.

**Fit for singularity:**  
- ✅ Preset-like layout via pinned positions.  
- ✅ Zoom API so overlays (axis) can scale with graph zoom.  
- ✅ Lighter than G6; simple mental model.  
- ❌ No minimap/legend out of the box; you build them (or a minimal “position in graph” indicator).  
- ⚠️ Force-directed branding; you use it as “pinned layout” so naming/docs may feel slightly off.

**Best for:** Lean “graph + smart axis” without heavy UI; you keep full control of overlay behavior and zoom sync.

---

### 4.3 Cytoscape.js + react-cytoscapejs

**Layout:** Many layouts; **preset** uses your (x,y). Supports compound nodes (e.g. domain as parent), which could map to “domain clusters” for future grouping.

**Overlays / narrative:**  
- No built-in axes or minimap; extensions exist (e.g. minimap). You’d add Tier/TRL axis as an external overlay and sync with Cytoscape’s viewport (zoom/pan).  
- Very flexible styling (node/edge color, size, labels); fits domain/status/importance.  
- Extensions (e.g. edgehandles, context menus) can support “add dependency” or “show path” later.

**Interaction:** Selection, hover, click, zoom/pan; viewport and zoom are queryable. Filtering = hide/dim nodes by domain.

**React:** **react-cytoscapejs**; graph is a component. Overlays live in React; you’d sync with Cytoscape instance ref (zoom/pan).

**Fit for singularity:**  
- ✅ Preset layout, compound nodes for future domain “hulls.”  
- ✅ Strong styling and algorithms (paths, centrality) if you add “unlock paths” or “critical tech” features.  
- ⚠️ Steeper learning curve; more “framework” than “component.”  
- ❌ No built-in narrative widgets; you build axis and optionally minimap.

**Best for:** Long-term flexibility and analysis (paths, clusters, future time layers); narrative overlays you implement with full viewport control.

---

### 4.4 Sigma.js (v2)

**Layout:** No built-in layout; you assign (x,y) (e.g. from your tier/domain logic). Graph data lives in **Graphology**; Sigma renders.  
**Overlays:** None built-in; you’d add React overlays and use Sigma’s camera for zoom/pan.  
**React:** No official React wrapper; you wrap the canvas in a ref and manage lifecycle.  
**Fit for singularity:** Good performance and flexibility, but more “engine” than “product”; you build everything (axis, minimap, filters) on top. Better if you later need very large graphs and custom rendering.

---

### 4.5 vis-network

**Layout:** Basic layouts; no first-class “preset from my coordinates.” You can set positions per node but the API is less layout-centric than G6/Cytoscape.  
**Overlays:** No axes/minimap.  
**Fit for singularity:** Simpler and lighter but less aligned with “semantic tech tree with custom layout and rich overlays”; not the best fit for a narrative-driven singularity map.

---

## 5. Summary matrix (singularity viz)

| Criterion | Cosmos.gl | G6/Graphin | react-force-graph | Cytoscape.js | Sigma.js |
|-----------|------------|------------|-------------------|--------------|----------|
| Preset (tier/domain) layout | ✅ | ✅ | ✅ (pinned) | ✅ | ✅ |
| Stable on filter | ✅ | ✅ | ✅ | ✅ | ✅ |
| Zoom/pan API for overlay sync | ❌ | ✅ | ✅ (onZoom) | ✅ | ✅ |
| Built-in minimap | ❌ | ✅ | ❌ | Extension | ❌ |
| Built-in legend / toolbar | ❌ | ✅ | ❌ | ❌ | ❌ |
| Custom axis (Tier/TRL) | You build | You build | You build | You build | You build |
| React / overlay composition | Manual | ✅ Graphin | ✅ | ✅ wrapper | DIY |
| Domain/status styling | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dual view (graph + embedding) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Learning curve | Low | Medium | Low | Higher | Medium |
| Bundle size | Small | Larger | Medium | Medium | Medium |

---

## 6. Recommendation for “interactive visualization of the technological singularity”

### Primary recommendation: **AntV G6 + Graphin**

- **Narrative and orientation:** Minimap + Legend + Toolbar give “where am I” and “what do colors mean” without you building from zero. Your Tier/TRL axis stays a custom React overlay but sits in the same component tree and can use G6’s zoom/center for scaling or labels.
- **Layout:** Preset layout with your (tier, domain) → (x,y) keeps the “progress” story (foundational → advanced, by domain).
- **Product feel:** Fits a public “singularity map” with clear controls and a professional, explorable feel.
- **Dual view:** Graphin is one view; your existing EmbeddingView stays; Header/DomainFilter/NodeDetail work as today.

**Migration outline:**  
- Replace CosmosGraph with a Graphin-based container that:  
  - Takes TECH_TREE, maps nodes/links to G6 format, sets **preset** positions from your current `generatePositions()`.  
  - Uses **MiniMap**, **Legend** (domain colors), and **Toolbar** (fit view, zoom).  
  - Keeps **AxisCorner** (or equivalent) as a React overlay, driven by G6 zoom/pan if the API exposes it (or by container resize as today).  
- Replicate filterByDomains by updating node/edge styles or visibility.  
- Keep getNodeScreenPositions equivalent via G6’s coordinate conversion for NodeLabelsOverlay and tooltips.

### Alternative: **react-force-graph**

- Choose this if you want **minimal dependency** and are fine building a minimal “position” or minimap yourself.  
- You get **onZoom** and clear overlay composition; Tier/TRL axis can scale with graph zoom and feel “alive.”  
- Best when you prefer a lighter stack and full control over every overlay.

### Keep Cosmos.gl only if

- You accept that axes and overlays stay viewport-scaled only (no canvas-zoom sync).  
- You don’t need a built-in minimap and are fine with the current “static” overlay feel.  
- Avoiding migration cost is more important than narrative polish and zoom-synced overlays.

---

## 7. Narrative-specific features to add (any library)

Regardless of engine, these will strengthen the “singularity progress” story:

1. **Tier/TRL axis** that either scales with graph zoom or stays readable (large enough) on viewport resize; optional “current view” band (e.g. which Tier range is visible).
2. **Minimap** (or “you are here” indicator) so large graphs don’t feel disorienting.
3. **Domain legend** (you have it); consider **status legend** (achieved / in progress / theoretical / speculative) so the map reads as a progress dashboard.
4. **“Fit to selection”** or “Focus on this domain” that zooms to a subset (you have zoomToDomain; ensure it’s exposed in the UI).
5. **Temporal layer (future):** Filter or color by year (achieved vs estimated); slider or buckets so the map can show “where we were” vs “where we’re going.”

This document prioritizes the graph engine; the same narrative ideas apply whether you stay on Cosmos or move to G6/Graphin or react-force-graph.
