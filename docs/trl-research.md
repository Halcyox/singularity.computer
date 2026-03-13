# TRL Research and Assignments

Technology Readiness Levels (TRL 1–9) per NASA/DOE: **1–3** research & concept, **4–6** validation & prototype, **7–9** system & operational.

## Research summary (sources: NASA, DOE, IAEA, clinical/industry reports)

| Domain / tech | TRL range | Notes |
|---------------|-----------|--------|
| **CRISPR / gene editing** | 8–9 | FDA-approved therapy (Casgevy 2023); clinical trials for multiple indications. |
| **mRNA therapeutics** | 8–9 | COVID vaccines deployed; cancer/other applications in trials. |
| **Senolytics** | 4–5 | Phase 2 trials (D+Q, fisetin); biomarker-defined responders. |
| **LLMs / conversational AI** | 8–9 | Enterprise deployment (GPT, Gemini, Claude); production use. |
| **Fusion (tokamak, etc.)** | 4–6 | NIF ignition; ITER/private pilots; grid connection target 2030s–2040s. |
| **Quantum computing** | 3–5 | Supremacy demonstrated; error correction and scaling R&D; no broad commercial use yet. |
| **Solar PV, wind, Li-ion** | 9 | Mature, grid-deployed. |
| **AGI / superintelligence** | 1–2 | Theoretical / speculative. |

## Assignment rules used in data

- **achieved** + commercial/deployed → **8–9** (e.g. mRNA 9, CRISPR therapy 8, LLMs 8–9).
- **achieved** + foundational (older) → **7–8** (e.g. genome sequencing 7, deep nets 8).
- **in_progress** + late-stage (pilot, phase 2+) → **5–6** (e.g. fusion 5, senolytics 5, gene therapy 6).
- **in_progress** + early prototype → **4–5** (e.g. solid-state batteries 4, perovskite 4).
- **theoretical** → **2–3** (e.g. AGI 2, longevity escape velocity 3).
- **speculative** → **1** (e.g. mind uploading 1).

Where a node has explicit `trl` in the data, that overrides the derived value from status/tier in `src/utils/trl.ts`.
