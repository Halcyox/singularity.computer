# Tech Tree Data Audit

Systematic review of each technology node: verified facts, corrected data, and added missing fields. Research was done online to align descriptions, years, milestones, and key players with authoritative sources.

## Summary of changes

### AI
- **Deep Neural Networks**: Key players updated to Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton (AlexNet team). Milestone description tightened (ILSVRC 2012, top-5 error 15.3%).
- **Transformer**: Already accurate (2017, Vaswani et al., Google Brain).
- **GPT-3 / ChatGPT / GPT-4**: Years and scale verified (2020, 2022, 2023).
- **Chain-of-Thought / Agents / Multimodal / Video / World Models / Long-Horizon / AGI nodes**: Descriptions and status/TRL left as-is; data consistent.

### Energy
- **NIF Ignition**: Date corrected from 2022-12-13 to **2022-12-05** (LLNL announced net energy gain Dec 5, 2022). Description updated to cite 2.05 MJ in, 3.15 MJ out.
- **Solar PV / Wind / Lithium-Ion / Grid Storage / Perovskite / Solid-State / Tokamak / Net Gain / SMR / Space Solar / Wireless**: Descriptions and years verified or left as-is.

### Biotech
- **Genome Sequencing**: 2003 (Human Genome Project completion) verified.
- **CRISPR**: 2012 (Doudna/Charpentier Science paper, June 28) verified; key players and milestone already correct.
- **Gene Therapy / mRNA / Synthetic Biology / Senolytics / Epigenetic Reprogramming / Xenotransplant / De-Extinction**: Descriptions and milestones verified (e.g. Casgevy 2023, pig kidney 2024-03-21).

### Quantum
- **Quantum Supremacy**: 2019-10-23 (Google Sycamore, Nature) verified.
- **NISQ**: progressValue "1,121 qubits" matches IBM Condor (Dec 2023).
- **Logical Qubits**: Google Willow below-threshold correction (2024-12-09) kept.
- **QKD / Quantum Internet / General Advantage**: Descriptions and TRL/estimates left as-is.

### Nanotech
- **Carbon Nanotubes**: Added keyPlayers (Sumio Iijima, NEC), milestone (1991-11-07, Nature “Helical microtubules of graphitic carbon”). Description clarified (graphitic carbon, strength/conductivity).
- **Graphene**: Added keyPlayers (Andre Geim, Konstantin Novoselov). Description and 2004 milestone refined (mechanical exfoliation, Science 2004).
- **Atomic Manipulation**: IBM logo 1989 kept as-is.
- **Quantum Dots / Metamaterials / Medical Nanobots / etc.**: Descriptions and TRL verified or unchanged.

### Space
- **Orbital / Moon / Reusable Rockets**: Years verified (1961, 1969, 2015).
- **Super Heavy Lift (Starship)**: Milestone date 2024-10-13 verified (first booster catch with chopsticks, Flight 5).
- **Commercial Stations / Satellite Internet / Mars / Lunar Base**: Left as-is.

### Neurotech
- **EEG**: Added keyPlayers (Hans Berger), milestone (1924-07-06, first human EEG).
- **fMRI**: Description updated (BOLD signal). Added keyPlayers (Seiji Ogawa, Kenneth Kwong).
- **Invasive BCIs**: Neuralink 2024-01-29, Telepathy demo 2024-03-20 kept.
- **Thought-to-Text**: Milestone description updated to “UCSF/Stanford: brain implants decode speech at 62–78 words/min (Nature)” (2023-08-23).
- **Connectome**: Fruit fly connectome 2024 kept.

### Robotics
- **Industrial / Robot Vision / Bipedal / Quadruped / Dexterous / Soft / Humanoids**: Years and key players (Boston Dynamics, Atlas 2013, etc.) verified; no changes needed.

### Compute
- **Integrated Circuits**: Description expanded (transistors, resistors, capacitors on single substrate). Added keyPlayers (Jack Kilby, Robert Noyce, Texas Instruments, Fairchild), milestone (1958-09-12, Kilby demonstration at TI).
- **GPU / 5nm / 3nm / 2nm / AI Accelerators / HBM / Chiplets / Photonic / Molecular / etc.**: Descriptions and years verified or unchanged.

## Data quality checklist (per node)

For each technology we aimed for:

- **description**: Clear, accurate, one or two sentences; no placeholders.
- **status**: achieved | in_progress | theoretical | speculative — aligned with current state.
- **yearAchieved** (if achieved): Matches first major demonstration or deployment where applicable.
- **yearEstimated** (if not achieved): Plausible range; noted in audit where refined.
- **trl**: 1–9 consistent with status and tier.
- **keyPlayers**: Companies, labs, or key researchers where notable.
- **milestones**: Date (YYYY-MM-DD), title, short description, significance (breakthrough | major).
- **progress** (in_progress): 0–100 where quantifiable.
- **progressMetric / progressValue**: Where a standard metric exists (e.g. qubit count, MMLU, wpm).

## Sources used

- Nature, Science, IEEE Spectrum, Wikipedia (for dates and technical claims).
- Company and lab announcements (IBM, Google, OpenAI, SpaceX, LLNL, Stanford, UCSF, etc.).
- Government and project sites (Human Genome Project, ITER, NIF).

## Recommended follow-ups

1. **Ongoing**: Update progress/progressValue and milestones as new results publish (e.g. quantum error correction, fusion pilots, AI benchmarks).
2. **Optional**: Add `sources` array to high-stakes nodes (AGI, fusion, longevity, brain–machine) with URLs or DOIs.
3. **Optional**: Standardize progress metrics per domain (e.g. AI: MMLU/SWE-Bench; quantum: qubit count / gate fidelity; biotech: trial phase).
