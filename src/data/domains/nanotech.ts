import { TechNode } from '../../types';

/**
 * Nanotechnology domain nodes
 * Molecular-scale engineering and materials
 */
export const NANOTECH_NODES: TechNode[] = [
  // === FOUNDATIONAL (Tier 0) ===
  {
    id: 'nano-carbon-nanotubes',
    name: 'Carbon Nanotubes',
    description: 'Cylindrical graphitic carbon with extreme strength and conductivity',
    domain: 'nanotech',
    status: 'achieved',
    yearAchieved: 1991,
    importance: 7,
    tier: 0,
    trl: 7,
    keyPlayers: ['Sumio Iijima', 'NEC'],
    milestones: [
      {
        date: '1991-11-07',
        title: 'Helical microtubules of graphitic carbon',
        description: 'Iijima (Nature) reported multi-wall carbon nanotubes from arc discharge',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/354056a0',
      },
    ],
  },
  {
    id: 'nano-graphene',
    name: 'Graphene',
    description: 'Single-atom-thick carbon sheets with exceptional electronic and mechanical properties',
    domain: 'nanotech',
    status: 'achieved',
    yearAchieved: 2004,
    importance: 8,
    tier: 0,
    trl: 7,
    keyPlayers: ['Andre Geim', 'Konstantin Novoselov'],
    milestones: [
      {
        date: '2004-10-22',
        title: 'Graphene Isolation',
        description: 'Geim and Novoselov isolate monolayer graphene by mechanical exfoliation (Science)',
        significance: 'breakthrough',
        source: 'https://www.science.org/doi/10.1126/science.1102896',
      },
    ],
  },
  {
    id: 'nano-afm-stm',
    name: 'Atomic Manipulation',
    description: 'Moving individual atoms with scanning probes',
    domain: 'nanotech',
    status: 'achieved',
    yearAchieved: 1989,
    importance: 8,
    tier: 0,
    trl: 7,
    milestones: [
      {
        date: '1989-11-11',
        title: 'IBM Logo in Atoms',
        description: 'Eigler et al. position 35 xenon atoms with STM to spell IBM (Nature)',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/342524a0',
      },
    ],
  },

  // === NANOMATERIALS (Tier 1) ===
  {
    id: 'nano-quantum-dots',
    name: 'Quantum Dots',
    description: 'Semiconductor nanocrystals for displays and solar cells',
    domain: 'nanotech',
    status: 'achieved',
    yearAchieved: 2013,
    importance: 7,
    tier: 1,
    trl: 8,
    keyPlayers: ['Samsung', 'Nanosys'],
    milestones: [
      {
        date: '2013-03-01',
        title: 'Samsung QD TV',
        description: 'Samsung launches first quantum-dot LCD TVs (S9)',
        significance: 'major',
        source: 'https://news.samsung.com/global/samsung-electronics-unveils-worlds-first-curved-uhd-tv',
      },
    ],
  },
  {
    id: 'nano-metamaterials',
    name: 'Metamaterials',
    description: 'Materials with engineered properties not found in nature',
    domain: 'nanotech',
    status: 'in_progress',
    importance: 8,
    tier: 1,
    trl: 5,
    progress: 55,
    milestones: [
      {
        date: '2000-06-01',
        title: 'Negative Refraction',
        description: 'Smith et al. demonstrate negative refractive index at microwave frequencies (Science)',
        significance: 'breakthrough',
        source: 'https://www.science.org/doi/10.1126/science.289.5485.1534',
      },
    ],
  },
  {
    id: 'nano-self-healing',
    name: 'Self-Healing Materials',
    description: 'Materials that repair damage automatically',
    domain: 'nanotech',
    status: 'in_progress',
    importance: 7,
    tier: 2,
    trl: 4,
    progress: 40,
    milestones: [
      {
        date: '2001-02-01',
        title: 'Self-Healing Polymers',
        description: 'White et al. report microencapsulated healing agent in polymer (Nature)',
        significance: 'major',
        source: 'https://www.nature.com/articles/35059220',
      },
    ],
  },

  // === DNA NANOTECHNOLOGY (Tier 2) ===
  {
    id: 'nano-dna-origami',
    name: 'DNA Origami',
    description: 'Using DNA to build precise nanostructures',
    domain: 'nanotech',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 5,
    keyPlayers: ['Caltech', 'Harvard Wyss Institute'],
    progress: 60,
    milestones: [
      {
        date: '2006-03-16',
        title: 'Scaffolded DNA Origami',
        description: 'Rothemund (Caltech) folds DNA into arbitrary 2D shapes (Nature)',
        significance: 'breakthrough',
        source: 'https://www.nature.com/articles/nature04586',
      },
    ],
  },
  {
    id: 'nano-molecular-machines',
    name: 'Molecular Machines',
    description: 'Nanoscale devices that perform mechanical tasks',
    domain: 'nanotech',
    status: 'in_progress',
    importance: 9,
    tier: 2,
    trl: 5,
    dependencies: ['nano-dna-origami'],
    progress: 35,
    milestones: [
      {
        date: '2016-10-05',
        title: 'Nobel Prize for Molecular Machines',
        description: 'Sauvage, Stoddart, Feringa awarded for design of molecular machines',
        significance: 'breakthrough',
        source: 'https://www.nobelprize.org/prizes/chemistry/2016/press-release/',
      },
    ],
  },

  // === MEDICAL NANOTECHNOLOGY (Tier 2-3) ===
  {
    id: 'nano-drug-delivery',
    name: 'Targeted Drug Delivery',
    description: 'Nanoparticles that deliver drugs to specific cells',
    domain: 'nanotech',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 6,
    progress: 55,
    keyPlayers: ['Moderna', 'Alnylam'],
    milestones: [
      {
        date: '1995-01-01',
        title: 'Doxil Approval',
        description: 'First FDA-approved nanoscale drug delivery (liposomal doxorubicin)',
        significance: 'major',
        source: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2010/050718s029lbl.pdf',
      },
    ],
  },
  {
    id: 'nano-nanobots-medical',
    name: 'Medical Nanobots',
    description: 'Programmable nanoscale robots for medical intervention',
    domain: 'nanotech',
    status: 'theoretical',
    importance: 9,
    tier: 3,
    trl: 3,
    dependencies: ['nano-molecular-machines', 'nano-drug-delivery'],
    yearEstimated: 2040,
    milestones: [
      {
        date: '2018-08-01',
        title: 'DNA Nanorobots in Vivo',
        description: 'Li et al. demonstrate DNA origami robots for targeted thrombin delivery (Nature Biotechnol.)',
        significance: 'major',
        source: 'https://www.nature.com/articles/nbt.4071',
      },
    ],
  },

  // === ADVANCED MANUFACTURING (Tier 3+) ===
  {
    id: 'nano-atomically-precise',
    name: 'Atomically Precise Manufacturing',
    description: 'Building structures atom by atom',
    domain: 'nanotech',
    status: 'theoretical',
    importance: 10,
    tier: 4,
    trl: 2,
    dependencies: ['nano-molecular-machines'],
    yearEstimated: 2045,
  },
  {
    id: 'nano-molecular-assembler',
    name: 'Molecular Assemblers',
    description: 'Machines that build anything from atomic feedstock',
    domain: 'nanotech',
    status: 'speculative',
    importance: 10,
    tier: 5,
    trl: 1,
    dependencies: ['nano-atomically-precise'],
    milestones: [
      {
        date: '1986-01-01',
        title: 'Engines of Creation',
        description: 'Drexler popularizes molecular assemblers and gray goo (book)',
        significance: 'major',
        source: 'https://www.fhi.ox.ac.uk/engines-of-creation/',
      },
    ],
  },
  {
    id: 'nano-grey-goo-safe',
    name: 'Safe Self-Replication',
    description: 'Controlled self-replicating nanosystems',
    domain: 'nanotech',
    status: 'speculative',
    importance: 10,
    tier: 5,
    trl: 1,
    dependencies: ['nano-molecular-assembler'],
    milestones: [
      {
        date: '2007-01-01',
        title: 'Safe-by-Design Nanotech',
        description: 'EU and US agencies adopt safe-by-design frameworks for nanotechnology',
        significance: 'minor',
        source: 'https://ec.europa.eu/health/scientific_committees/opinions_layman/en/nanotechnologies/l-2/6-regulatory-framework-nanotechnology.htm',
      },
    ],
  },
];

export default NANOTECH_NODES;
