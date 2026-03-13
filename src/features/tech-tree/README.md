# Tech tree feature

Encapsulated pieces for the graph view.

- **AxisCorner** – Tier/TRL scale in the bottom-left. Renders via `createPortal(..., document.body)` so it stays on top of the canvas. Use `<AxisCorner visible={isReady} />` when the graph is the active view.

Import from `@/features/tech-tree` or `../../features/tech-tree`:

```ts
import { AxisCorner } from '../../features/tech-tree';
```

Future: move `useTechGraph`, `CosmosGraph`, and the full graph view into this feature so the tech-tree view is one self-contained module.
