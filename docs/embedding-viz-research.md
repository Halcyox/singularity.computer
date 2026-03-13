# Embedding visualization: research and recommendations

## 1. Why do points “gravitationally” pull toward each other?

The current tech tree uses **Cosmos.gl**, a **force-directed graph** engine. In that model, three things make points move toward each other or toward a center:

| Force | Config | Effect |
|-------|--------|--------|
| **Link spring** | `simulationLinkSpring: 0.3`, `simulationLinkDistance: 50` | Connected nodes are pulled together like springs. This is by design: dependency/related links attract. |
| **Center of mass** | `simulationCenter: 0.2` | All points are pulled toward the graph’s center of mass, so the cloud stays compact and doesn’t drift to (4096,4096). |
| **Repulsion** | `simulationRepulsion: 1.0` | Nodes push apart; it counterbalances springs so the graph doesn’t collapse to a single point. |

So the “gravitational” feel is **intentional** for a **graph**: links pull connected nodes together, and the center force keeps the layout from flying off. That’s different from **embedding** visualization (TensorBoard-style), where positions come only from **reduced embedding coordinates** and there is no physics.

**Summary:**  
- **Graph (current):** positions come from simulation (springs + center + repulsion) → nodes “pull together” along edges.  
- **Embedding (TensorBoard-style):** positions = 2D/3D from PCA/t-SNE/UMAP on vectors → no link forces; geometry is purely from the embedding.

---

## 2. Why might points look white? (We do set colors)

In code we **do** assign colors per node:

- **`generateColors(nodes)`** in `CosmosGraph.ts` uses `DOMAINS[node.domain].color` (hex) → `hexToRgba()` → RGBA in 0–255 (R,G,B) and alpha 1.
- We call **`this.graph.setPointColors(colors)`** after `setPointPositions` and again in **`filterByDomains()`** when filtering.

So by design, points should be **domain-colored**, not white. If they appear white, likely causes are:

1. **Selection greyout** – Cosmos.gl has `pointGreyoutOpacity` / `pointGreyoutColor` when a point is selected; non-selected points can be dimmed or tinted. Worth checking the default greyout behavior.
2. **Link color** – `linkDefaultColor: '#ffffff'` and link opacity can make edges bright; if edges dominate the view, the overall impression can be “white.”
3. **Rendering order / blending** – Points drawn under bright links or with wrong blend mode could look washed out.
4. **Library bug or override** – Less likely, but possible (e.g. internal default overwriting our colors in some code path).

**Recommendation:** Keep domain colors as-is; if the UI still looks white, inspect Cosmos.gl’s greyout/selection and link rendering, and consider turning down link opacity or changing `linkDefaultColor` so points read clearly.

---

## 3. Embedding geometry vs force-directed (TensorBoard vs current)

| Aspect | TensorBoard-style embedding | Current Cosmos.gl graph |
|--------|-----------------------------|--------------------------|
| **Position source** | 2D/3D from PCA, t-SNE, or UMAP on high‑dim vectors | Force simulation (springs, center, repulsion) from links + initial layout |
| **Meaning of (x,y)** | “Similar in embedding space” | “Connected in graph” + “spread for readability” |
| **Links** | Optional (e.g. k-NN); not required for layout | Central: layout is driven by link forces |
| **Use case** | Explore vector embeddings (e.g. from a model) | Explore graph structure (nodes + edges) |

For a **tech tree**, you have both:

- **Graph structure:** dependencies and “related” links → force-directed layout is a good fit.
- **Optional “embedding” view:** if each node had a vector (e.g. from an embedding model), you could **also** show a 2D/3D projection (t-SNE/UMAP/PCA) where position = embedding geometry and color = domain (or another label). That would be a second view, TensorBoard-style, not a replacement of the graph view unless you want to drop links from the layout.

So:

- **Current:** graph with link-based physics and domain colors is correct for “nodes and edges.”
- **Embedding geometry:** add it only if you have (or will compute) **per-node vectors** and want a separate “embedding space” visualization (e.g. “how similar are these techs in embedding space?”).

---

## 4. Performant web libraries for embedding-style visualization

### Criteria (TensorBoard-like, web, performant)

- **Input:** high‑dim vectors (or precomputed 2D/3D).
- **Output:** 2D/3D scatter with pan/zoom, color/size by metadata.
- **Scale:** 10k–1M+ points, 60fps where possible (GPU).
- **Optional:** in-browser dimensionality reduction (t-SNE, UMAP, PCA).

### Library overview

| Library | Strengths | Limitations | Best for |
|--------|-----------|-------------|----------|
| **regl-scatterplot** | WebGL, up to ~20M points, color/size/opacity, lasso, small API | 2D-focused; no built-in t-SNE/UMAP | **Embedding scatter plots** (precomputed 2D/3D), maximum performance |
| **deck.gl** (e.g. ScatterplotLayer) | WebGL2, React, maps, many layer types | Positions are 2D/3D only; no built-in dim reduction; map-centric docs | **Large scatter on map or 3D**; use with precomputed coordinates |
| **Three.js** (custom scatter) | Full 3D, many examples (t-SNE/UMAP + Three.js) | You build the scatter and interactions | **Custom 3D embedding viewer** (e.g. TensorBoard-like 3D) |
| **umap-js** | UMAP in the browser (PAIR-code), fit/transform, progress | CPU-bound; slow for very large N | **In-browser 2D (or 3D) UMAP**; then pass coords to regl-scatterplot or deck.gl |
| **t-SNE in JS** | Various implementations (e.g. tsne.js, realtime-layout) | CPU, iteration count matters | **In-browser t-SNE**; again, pair with a WebGL scatter |
| **TensorBoard Embedding Projector (standalone)** | PCA/t-SNE, 3D, search, metadata | Standalone app; not a drop-in React component | **Reference implementation**; reuse ideas, not necessarily the code |

### Recommended pattern for “TensorBoard-like” in your app

1. **Positions (embedding geometry)**  
   - **Option A:** Precompute 2D/3D (e.g. Python: UMAP/t-SNE/PCA) and load JSON.  
   - **Option B:** In-browser: **umap-js** (or a t-SNE lib) for small/medium N; then pass coordinates to the renderer.

2. **Rendering (performant points)**  
   - **regl-scatterplot** for 2D: per-point color/size, lasso, pan/zoom, very fast.  
   - **deck.gl ScatterplotLayer** if you want React integration and don’t need 20M points.  
   - **Three.js** if you want a full 3D “projector” experience (rotate, 3D t-SNE/UMAP).

3. **Colors**  
   - Use your existing **domain (or other metadata)** → color mapping in the scatter layer’s accessors (e.g. `getFillColor` in deck.gl, or regl-scatterplot’s color encoding).

### Summary recommendation

- **For a dedicated “embedding view” (TensorBoard-style) in the web app:**  
  - **regl-scatterplot** for 2D scatter (best performance, clear API).  
  - **umap-js** (and/or a small t-SNE lib) if you need in-browser reduction.  
  - Optionally **deck.gl** if you prefer React components and slightly lower max point count is acceptable.

- **For the current tech tree:**  
  - Keep Cosmos.gl for **graph** layout (links + forces).  
  - Keep **domain-based point colors**; debug greyout/link color if things look white.  
  - Add an **embedding view** only if you have node vectors and want to show “embedding geometry” separately (e.g. second tab or panel).

---

## References (brief)

- TensorBoard Embedding Projector: PCA, t-SNE, 3D, metadata.  
- regl-scatterplot: https://github.com/flekschas/regl-scatterplot (WebGL, 2D, very scalable).  
- deck.gl ScatterplotLayer: 2D/3D, React, GPU.  
- umap-js: https://github.com/PAIR-code/umap-js (in-browser UMAP).  
- Yale DHLab realtime-layout: t-SNE/UMAP + JS.  
- TensorBoard standalone: https://github.com/tensorflow/embedding-projector-standalone.
