import { TechNode } from '../../types';

/**
 * Quantum domain nodes
 * Computing, sensing, and communication beyond classical limits
 */
export const QUANTUM_NODES: TechNode[] = [
  // === FOUNDATIONAL (Tier 0) ===
  {
    id: 'quantum-superconducting',
    name: 'Superconducting Qubits',
    description: 'Quantum bits using superconducting circuits',
    domain: 'quantum',
    status: 'achieved',
    yearAchieved: 1999,
    importance: 8,
    tier: 0,
    trl: 7,
    keyPlayers: ['IBM', 'Google', 'Rigetti'],
    milestones: [
      {
        date: '1999-04-29',
        title: 'First Superconducting Qubit',
        description: 'Nakamura et al. (NEC) demonstrate coherent control of Cooper-pair box in Nature',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/19718',
      },
      {
        date: '1999-01-01',
        title: 'D-Wave Founded',
        description: 'First company focused on quantum annealing hardware',
        significance: 'major',
        source: 'https://www.dwavesys.com/company/about-d-wave',
      },
    ],
  },
  {
    id: 'quantum-trapped-ion',
    name: 'Trapped Ion Qubits',
    description: 'Qubits using individual trapped ions',
    domain: 'quantum',
    status: 'achieved',
    yearAchieved: 1995,
    importance: 7,
    tier: 0,
    trl: 7,
    keyPlayers: ['IonQ', 'Quantinuum', 'Alpine Quantum'],
    milestones: [
      {
        date: '1995-06-12',
        title: 'Cirac–Zoller Proposal',
        description: 'Ion-trap quantum computing and CNOT gate proposal (Phys. Rev. Lett.)',
        significance: 'breakthrough',
        source: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.74.4091',
      },
      {
        date: '2021-10-01',
        title: 'IonQ SPAC',
        description: 'IonQ goes public as first dedicated quantum computing company',
        significance: 'major',
        source: 'https://www.ionq.com/news/october-01-2021-ionq-listed-on-nyse',
      },
    ],
  },

  // === CURRENT SYSTEMS (Tier 1) ===
  {
    id: 'quantum-nisq',
    name: 'NISQ Computers',
    description: 'Noisy intermediate-scale quantum computers (50-1000 qubits)',
    domain: 'quantum',
    status: 'achieved',
    yearAchieved: 2019,
    importance: 8,
    tier: 1,
    trl: 6,
    dependencies: ['quantum-superconducting'],
    keyPlayers: ['IBM', 'Google', 'IonQ'],
    progressMetric: 'Qubit Count',
    progressValue: '1,121 qubits',
    milestones: [
      {
        date: '2019-10-23',
        title: 'Quantum Supremacy',
        description: 'Google Sycamore 53-qubit task in 200s vs 10k years classical',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/s41586-019-1666-5',
      },
      {
        date: '2023-12-04',
        title: 'IBM Condor',
        description: 'IBM releases 1,121-qubit superconducting processor',
        significance: 'major',
        source: 'https://research.ibm.com/blog/quantum-roadmap-2033',
      },
    ],
  },
  {
    id: 'quantum-error-mitigation',
    name: 'Error Mitigation',
    description: 'Techniques to reduce noise in quantum computations',
    domain: 'quantum',
    status: 'in_progress',
    importance: 8,
    tier: 1,
    trl: 5,
    dependencies: ['quantum-nisq'],
    progress: 60,
    milestones: [
      {
        date: '2022-06-15',
        title: 'Zero-Noise Extrapolation',
        description: 'IBM and others deploy error mitigation in cloud quantum runs',
        significance: 'major',
        source: 'https://arxiv.org/abs/2005.10921',
      },
    ],
  },

  // === ERROR CORRECTION (Tier 2) ===
  {
    id: 'quantum-logical-qubit',
    name: 'Logical Qubits',
    description: 'Error-corrected qubits from multiple physical qubits',
    domain: 'quantum',
    status: 'in_progress',
    importance: 9,
    tier: 2,
    trl: 5,
    dependencies: ['quantum-error-mitigation'],
    keyPlayers: ['Google', 'IBM', 'QuEra'],
    progress: 35,
    milestones: [
      {
        date: '2024-12-04',
        title: 'Google Willow',
        description: 'First demonstration of below-threshold quantum error correction (Nature)',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/s41586-024-08449-y',
      },
    ],
  },
  {
    id: 'quantum-ftqc',
    name: 'Fault-Tolerant QC',
    description: 'Quantum computers with arbitrarily long coherence',
    domain: 'quantum',
    status: 'theoretical',
    importance: 10,
    tier: 3,
    trl: 3,
    dependencies: ['quantum-logical-qubit'],
    yearEstimated: 2030,
    milestones: [
      {
        date: '2021-05-01',
        title: 'FTQC Roadmaps',
        description: 'IBM and Google publish fault-tolerant quantum computing roadmaps',
        significance: 'major',
        source: 'https://research.ibm.com/blog/quantum-roadmap-2033',
      },
    ],
  },

  // === APPLICATIONS (Tier 2-3) ===
  {
    id: 'quantum-chemistry',
    name: 'Quantum Chemistry Simulation',
    description: 'Simulating molecular behavior for drug discovery',
    domain: 'quantum',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 4,
    dependencies: ['quantum-nisq'],
    keyPlayers: ['IBM', 'Google', 'Zapata'],
    progress: 30,
    milestones: [
      {
        date: '2014-07-06',
        title: 'VQE for Molecules',
        description: 'Peruzzo et al. demonstrate variational quantum eigensolver on photonic processor (Nature Commun.)',
        significance: 'major',
        source: 'https://www.nature.com/articles/ncomms5213',
      },
      {
        date: '2022-06-01',
        title: 'Pharma Partnerships',
        description: 'Merck, Roche, others run chemistry on IBM and cloud quantum',
        significance: 'minor',
        source: 'https://www.ibm.com/blog/quantum-chemistry-drug-discovery/',
      },
    ],
  },
  {
    id: 'quantum-optimization',
    name: 'Quantum Optimization',
    description: 'Solving complex optimization problems faster',
    domain: 'quantum',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 4,
    dependencies: ['quantum-nisq'],
    progress: 25,
    milestones: [
      {
        date: '2020-10-01',
        title: 'D-Wave Advantage',
        description: 'D-Wave ships 5,000-qubit quantum annealer for optimization',
        significance: 'major',
        source: 'https://www.dwavesys.com/company/newsroom/press-release/d-wave-announces-advantage-quantum-system',
      },
    ],
  },
  {
    id: 'quantum-ml',
    name: 'Quantum Machine Learning',
    description: 'Quantum-enhanced machine learning algorithms',
    domain: 'quantum',
    status: 'in_progress',
    importance: 7,
    tier: 2,
    trl: 4,
    dependencies: ['quantum-nisq'],
    progress: 20,
    milestones: [
      {
        date: '2019-12-01',
        title: 'Quantum ML Benchmarks',
        description: 'Google and others demonstrate quantum kernels for ML on NISQ devices',
        significance: 'major',
        source: 'https://arxiv.org/abs/1804.11326',
      },
    ],
  },

  // === QUANTUM NETWORKING (Tier 2-4) ===
  {
    id: 'quantum-key-distribution',
    name: 'Quantum Key Distribution',
    description: 'Unhackable encryption via quantum mechanics',
    domain: 'quantum',
    status: 'in_progress',
    importance: 7,
    tier: 2,
    trl: 6,
    keyPlayers: ['ID Quantique', 'Toshiba', 'China (Micius)'],
    progress: 65,
    milestones: [
      {
        date: '2016-08-16',
        title: 'Micius Satellite',
        description: 'China launches first quantum communication satellite for QKD',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/s41586-017-0011-6',
      },
    ],
  },
  {
    id: 'quantum-internet',
    name: 'Quantum Internet',
    description: 'Network of entangled quantum nodes',
    domain: 'quantum',
    status: 'theoretical',
    importance: 9,
    tier: 4,
    trl: 2,
    dependencies: ['quantum-key-distribution', 'quantum-ftqc'],
    yearEstimated: 2040,
    milestones: [
      {
        date: '2023-05-01',
        title: 'EU Quantum Internet Alliance',
        description: 'European roadmap for quantum internet prototype',
        significance: 'major',
        source: 'https://quantum-internet.team/',
      },
    ],
  },

  // === ADVANCED (Tier 4+) ===
  {
    id: 'quantum-advantage-general',
    name: 'General Quantum Advantage',
    description: 'Quantum computers faster for practical problems',
    domain: 'quantum',
    status: 'theoretical',
    importance: 10,
    tier: 4,
    trl: 3,
    dependencies: ['quantum-ftqc'],
    yearEstimated: 2035,
    milestones: [
      {
        date: '2023-06-01',
        title: 'Quantum Advantage Definitions',
        description: 'NIST and industry define practical quantum advantage benchmarks',
        significance: 'minor',
        source: 'https://www.nist.gov/publications/benchqc-benchmarking-toolkit-quantum-computation',
      },
    ],
  },
];

export default QUANTUM_NODES;
