import { TechNode } from '../../types';

/**
 * Neurotechnology domain nodes
 * Brain-computer interfaces and neural engineering
 */
export const NEUROTECH_NODES: TechNode[] = [
  // === FOUNDATIONAL (Tier 0) ===
  {
    id: 'neuro-eeg',
    name: 'EEG Brain Monitoring',
    description: 'Non-invasive electrical brain activity measurement',
    domain: 'neurotech',
    status: 'achieved',
    yearAchieved: 1924,
    importance: 6,
    tier: 0,
    trl: 8,
    keyPlayers: ['Hans Berger'],
    milestones: [
      {
        date: '1924-07-06',
        title: 'First human EEG',
        description: 'Berger recorded first human electroencephalogram',
        significance: 'breakthrough',
        source: 'https://journals.physiology.org/doi/full/10.1152/advan.00119.2024',
      },
    ],
  },
  {
    id: 'neuro-fmri',
    name: 'fMRI Neuroimaging',
    description: 'Functional brain imaging via blood-oxygen-level-dependent (BOLD) signal',
    domain: 'neurotech',
    status: 'achieved',
    yearAchieved: 1990,
    importance: 7,
    tier: 0,
    trl: 8,
    keyPlayers: ['Seiji Ogawa', 'Kenneth Kwong'],
    milestones: [
      {
        date: '1992-03-01',
        title: 'BOLD fMRI',
        description: 'Ogawa et al. demonstrate blood-oxygen-level-dependent functional MRI',
        significance: 'breakthrough',
        source: 'https://pubmed.ncbi.nlm.nih.gov/8386018/',
      },
    ],
  },
  {
    id: 'neuro-dbs',
    name: 'Deep Brain Stimulation',
    description: 'Implanted electrodes for treating neurological disorders',
    domain: 'neurotech',
    status: 'achieved',
    yearAchieved: 1987,
    importance: 7,
    tier: 0,
    trl: 8,
    keyPlayers: ['Medtronic', 'Boston Scientific'],
    milestones: [
      {
        date: '1987-01-01',
        title: 'High-Frequency DBS',
        description: 'Benabid discovers that high-frequency stimulation mimics lesion effects reversibly',
        significance: 'breakthrough',
        source: 'https://www.sciencedirect.com/science/article/abs/pii/S0959438803001339',
      },
    ],
  },

  // === CURRENT BCIs (Tier 1) ===
  {
    id: 'neuro-invasive-bci',
    name: 'Invasive BCIs',
    description: 'Implanted brain-computer interfaces',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 9,
    tier: 1,
    trl: 5,
    dependencies: ['neuro-dbs'],
    keyPlayers: ['Neuralink', 'Blackrock Neurotech', 'Synchron'],
    progress: 40,
    milestones: [
      {
        date: '2024-01-29',
        title: 'Neuralink Human Trial',
        description: 'First Neuralink implant in a human patient',
        significance: 'breakthrough',
        source: 'https://www.reuters.com/technology/neuralink-implants-brain-chip-first-human-musk-says-2024-01-29/',
      },
      {
        date: '2024-03-20',
        title: 'Telepathy Demo',
        description: 'Neuralink patient plays chess via thought (X livestream)',
        significance: 'major',
        source: 'https://www.neuralink.com/blog/',
      },
    ],
  },
  {
    id: 'neuro-non-invasive-bci',
    name: 'Non-Invasive BCIs',
    description: 'External brain interfaces without surgery',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 8,
    tier: 1,
    trl: 5,
    dependencies: ['neuro-eeg'],
    keyPlayers: ['Kernel', 'NextMind', 'OpenBCI'],
    progress: 35,
    milestones: [
      {
        date: '2023-05-01',
        title: 'Kernel Flux',
        description: 'Kernel ships non-invasive neuroimaging headset for research',
        significance: 'major',
        source: 'https://www.kernel.com/',
      },
    ],
  },

  // === NEURAL DECODING (Tier 2) ===
  {
    id: 'neuro-thought-to-text',
    name: 'Thought-to-Text',
    description: 'Converting imagined speech to text',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 5,
    dependencies: ['neuro-invasive-bci'],
    keyPlayers: ['Stanford', 'UCSF', 'Meta'],
    progress: 45,
    milestones: [
      {
        date: '2023-08-23',
        title: 'Speech Decoding Breakthrough',
        description: 'UCSF/Stanford: brain implants decode speech at 62–78 words/min (Nature)',
        significance: 'major',
        source: 'https://www.nature.com/articles/s41586-023-06377-x',
      },
    ],
  },
  {
    id: 'neuro-image-decoding',
    name: 'Visual Imagery Decoding',
    description: 'Reconstructing images from brain activity',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 4,
    dependencies: ['neuro-fmri'],
    progress: 30,
    milestones: [
      {
        date: '2023-03-06',
        title: 'High-Res Image Reconstruction',
        description: 'Takagi & Nishimoto: AI reconstructs images from fMRI with Stable Diffusion (Nature)',
        significance: 'major',
        source: 'https://www.nature.com/articles/s41583-023-00709-6',
      },
    ],
  },

  // === ADVANCED (Tier 3+) ===
  {
    id: 'neuro-bidirectional-bci',
    name: 'Bidirectional BCIs',
    description: 'Both reading and writing neural information',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 9,
    tier: 3,
    trl: 4,
    dependencies: ['neuro-invasive-bci'],
    progress: 20,
    yearEstimated: 2030,
    milestones: [
      {
        date: '2020-09-01',
        title: 'Bidirectional BCI in Paralysis',
        description: 'Preclinical and early clinical read-write BCI demonstrations',
        significance: 'major',
        source: 'https://www.nature.com/articles/s41593-020-00787-0',
      },
    ],
  },
  {
    id: 'neuro-memory-augmentation',
    name: 'Memory Augmentation',
    description: 'Enhancing memory storage and recall',
    domain: 'neurotech',
    status: 'theoretical',
    importance: 8,
    tier: 3,
    trl: 3,
    dependencies: ['neuro-bidirectional-bci'],
    yearEstimated: 2035,
    milestones: [
      {
        date: '2018-03-01',
        title: 'DARPA RAM Program',
        description: 'Restoring Active Memory: hippocampal stimulation for memory encoding',
        significance: 'major',
        source: 'https://www.darpa.mil/program/restoring-active-memory',
      },
    ],
  },
  {
    id: 'neuro-cognitive-enhancement',
    name: 'Cognitive Enhancement',
    description: 'Augmenting intelligence and processing speed',
    domain: 'neurotech',
    status: 'theoretical',
    importance: 9,
    tier: 4,
    trl: 2,
    dependencies: ['neuro-memory-augmentation'],
    yearEstimated: 2040,
    milestones: [
      {
        date: '2013-01-01',
        title: 'Human Brain Project',
        description: 'EU flagship project for large-scale brain simulation',
        significance: 'major',
        source: 'https://www.humanbrainproject.eu/',
      },
    ],
  },
  {
    id: 'neuro-brain-upload',
    name: 'Mind Uploading',
    description: 'Complete neural state transfer to digital substrate',
    domain: 'neurotech',
    status: 'speculative',
    importance: 10,
    tier: 5,
    trl: 1,
    dependencies: ['neuro-cognitive-enhancement'],
    milestones: [
      {
        date: '2014-01-01',
        title: 'Whole Brain Emulation Roadmap',
        description: 'Future of Humanity Institute technical roadmap for mind uploading',
        significance: 'minor',
        source: 'https://www.fhi.ox.ac.uk/brain-emulation-roadmap-report.pdf',
      },
    ],
  },

  // === BRAIN MAPPING (Tier 2-3) ===
  {
    id: 'neuro-connectome',
    name: 'Brain Connectome Mapping',
    description: 'Complete neural wiring diagram',
    domain: 'neurotech',
    status: 'in_progress',
    importance: 9,
    tier: 2,
    trl: 4,
    keyPlayers: ['Allen Institute', 'Janelia', 'Princeton'],
    progress: 25,
    milestones: [
      {
        date: '2024-10-02',
        title: 'Fruit Fly Connectome',
        description: 'Complete connectome of adult fruit fly brain (Janelia/Princeton)',
        significance: 'breakthrough',
        source: 'https://www.science.org/doi/10.1126/science.adk6854',
      },
    ],
  },
];

export default NEUROTECH_NODES;
