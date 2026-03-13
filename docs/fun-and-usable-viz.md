# What would actually be fun and usable?

The map is cool, but most visitors need to **get something in 10 seconds** and **want to poke around** without reading a manual. Here’s what would make singularity.computer feel fun and usable.

---

## 1. "Where are we?" in one glance

**Right now:** You see "118 TECHNOLOGIES" and "92 CONNECTIONS" — counts, not a story.

**Fun/usable:** One line that answers "How far along are we?"

- **Achieved 12 · In progress 34 · Theoretical 45 · Speculative 27** (real counts from your data)
- Or a tiny progress ring: "42% achieved or in progress"

**Why it’s fun:** No need to decode Tier/TRL first. The headline *is* the takeaway; the graph is "explore the details."

**Build:** Derive counts from `TECH_TREE.nodes` by `status`; show in the header or a slim strip under the title. No graph engine change.

---

## 2. "Follow the thread" — dependency paths

**Right now:** You click a node and see dependencies in the detail panel. You don’t *see* the path on the map.

**Fun/usable:** "Show path to this" or "What unlocks from here?"

- Click a node → **highlight its dependency chain** (prerequisites in one color, dependents in another) so you can follow "what leads to AGI?" or "what does fusion unlock?"
- Optional: "Path to [Artificial Superintelligence]" as a one-click zoom + highlight of the chain.

**Why it’s fun:** Discovery. You follow a story (a path) instead of staring at a cloud.

**Build:** Graph is already dependency-based. Add a "highlight path from/to this node" mode (walk links, set highlight indices or classes). Cosmos supports highlight; you’d need to compute the set of node indices for "dependencies of X" and "dependents of X."

---

## 3. "Surprise me" / discovery

**Right now:** You have to pan, zoom, and filter to find something.

**Fun/usable:** One button:

- **"Random tech"** — zoom to a random node (or a random "in progress" tech).
- Or **"Something in progress"** — zoom to a random in-progress node.

**Why it’s fun:** Low friction. One click and you’re exploring.

**Build:** Pick a random node (or filter by status), call `zoomToNode(nodeId)`. You already have the API.

---

## 4. Shareable view

**Right now:** You can’t share "my view" with someone.

**Fun/usable:** URL reflects state:

- `?domains=ai,energy` — open with those domains selected.
- `?node=ai-gpt4` — open with this node selected (and maybe zoomed to it).

**Why it’s usable:** "Here’s the AI + energy frontier" or "Look at this node" in one link.

**Build:** Read/write `searchParams` on load and when filter/selection changes. No graph change.

---

## 5. Less chart, more story (reframe the axis)

**Right now:** Tier/TRL axis is for people who already know what Tier and TRL mean.

**Fun/usable:** Don’t hide it, but **lead with status**:

- Headline: status counts (achieved / in progress / theoretical / speculative).
- Legend: "Green = achieved, Amber = in progress, …" so the map colors tell the story.
- Keep Tier/TRL in the corner for those who want it, or move to a "How to read this" tooltip.

**Why it’s usable:** "Progress" = status first; Tier/TRL = detail for nerds.

---

## Recommended order

| Priority | Thing | Why first |
|----------|--------|-----------|
| **1** | **Status headline** (achieved / in progress / theoretical / speculative) | Instant "where are we?" — no learning. One component, no migration. |
| **2** | **"Surprise me"** (random or in-progress zoom) | One button = discovery. Uses existing `zoomToNode`. |
| **3** | **Shareable URL** (?domains=, ?node=) | Makes the site shareable; good for posts and talks. |
| **4** | **Highlight path** (dependencies/dependents on click) | Makes the graph tell stories; a bit more logic, still no engine swap. |
| **5** | Status legend + optional "how to read" | Reinforces the headline; polish. |

The **actual thing** that’s fun and usable: **answer "where are we?" in one line, then make the graph the place you explore.** Status headline + "Surprise me" + shareable link gets you 80% of the way there without touching the graph engine.
