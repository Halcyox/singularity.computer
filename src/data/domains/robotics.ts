import { TechNode } from '../../types';

/**
 * Robotics domain nodes
 * Physical automation and embodied AI
 */
export const ROBOTICS_NODES: TechNode[] = [
  // === FOUNDATIONAL (Tier 0) ===
  {
    id: 'robotics-industrial',
    name: 'Industrial Robotics',
    description: 'Automated manufacturing and assembly',
    domain: 'robotics',
    status: 'achieved',
    yearAchieved: 1961,
    importance: 7,
    tier: 0,
    trl: 9,
    keyPlayers: ['FANUC', 'KUKA', 'ABB'],
    milestones: [
      {
        date: '1961-01-01',
        title: 'Unimate at GM',
        description: 'First industrial robot deployed at General Motors (Unimation)',
        significance: 'breakthrough',
        source: 'https://www.thehenryford.org/collections-and-research/digital-resources/popular-topics/automotive-history/unimate',
      },
    ],
  },
  {
    id: 'robotics-computer-vision',
    name: 'Robot Vision',
    description: 'Visual perception for robotic systems',
    domain: 'robotics',
    status: 'achieved',
    yearAchieved: 2015,
    importance: 7,
    tier: 0,
    trl: 8,
    milestones: [
      {
        date: '2012-01-01',
        title: 'Deep Learning for Vision',
        description: 'ConvNets enable robust object recognition for robotics (ImageNet)',
        significance: 'breakthrough',
        source: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
      },
    ],
  },

  // === LOCOMOTION (Tier 1) ===
  {
    id: 'robotics-bipedal',
    name: 'Bipedal Locomotion',
    description: 'Two-legged walking and running robots',
    domain: 'robotics',
    status: 'achieved',
    yearAchieved: 2013,
    importance: 8,
    tier: 1,
    trl: 8,
    keyPlayers: ['Boston Dynamics', 'Agility Robotics'],
    milestones: [
      {
        date: '2013-07-11',
        title: 'ATLAS Unveiled',
        description: 'Boston Dynamics humanoid demonstrates dynamic walking',
        significance: 'breakthrough',
        source: 'https://www.bostondynamics.com/atlas',
      },
    ],
  },
  {
    id: 'robotics-quadruped',
    name: 'Quadruped Robots',
    description: 'Four-legged robots with animal-like agility',
    domain: 'robotics',
    status: 'achieved',
    yearAchieved: 2019,
    importance: 7,
    tier: 1,
    trl: 8,
    keyPlayers: ['Boston Dynamics', 'Unitree', 'ANYbotics'],
    milestones: [
      {
        date: '2019-09-24',
        title: 'Spot Commercial Launch',
        description: 'Boston Dynamics begins selling Spot quadruped robot',
        significance: 'major',
        source: 'https://www.bostondynamics.com/about',
      },
    ],
  },

  // === MANIPULATION (Tier 2) ===
  {
    id: 'robotics-dexterous-hands',
    name: 'Dexterous Manipulation',
    description: 'Human-like hand dexterity in robots',
    domain: 'robotics',
    status: 'in_progress',
    importance: 9,
    tier: 2,
    trl: 5,
    dependencies: ['robotics-computer-vision'],
    keyPlayers: ['Shadow Robot', 'OpenAI', 'Google DeepMind'],
    progress: 50,
    milestones: [
      {
        date: '2023-07-01',
        title: 'OpenAI Dactyl to RT-2',
        description: 'Google DeepMind RT-2: vision-language-action model for robot control',
        significance: 'major',
        source: 'https://deepmind.google/discover/blog/rt-2-new-model-translates-vision-and-language-into-action/',
      },
    ],
  },
  {
    id: 'robotics-soft',
    name: 'Soft Robotics',
    description: 'Flexible, adaptable robot bodies',
    domain: 'robotics',
    status: 'in_progress',
    importance: 7,
    tier: 2,
    trl: 5,
    progress: 45,
    milestones: [
      {
        date: '2016-08-01',
        title: 'Octobot',
        description: 'First autonomous soft robot (no rigid components, Harvard)',
        significance: 'major',
        source: 'https://www.nature.com/articles/nature19100',
      },
    ],
  },

  // === HUMANOIDS (Tier 2-3) ===
  {
    id: 'robotics-humanoid-commercial',
    name: 'Commercial Humanoids',
    description: 'General-purpose humanoid robots for sale',
    domain: 'robotics',
    status: 'in_progress',
    importance: 9,
    tier: 2,
    trl: 6,
    dependencies: ['robotics-bipedal', 'robotics-dexterous-hands'],
    keyPlayers: ['Tesla', 'Figure', 'Boston Dynamics', '1X'],
    progress: 55,
    milestones: [
      {
        date: '2024-03-13',
        title: 'Figure 01 OpenAI Demo',
        description: 'Humanoid robot with conversational AI integration',
        significance: 'major',
        source: 'https://www.figure.ai/blog/figure-01-openai',
      },
      {
        date: '2024-10-10',
        title: 'Tesla Optimus Gen 2',
        description: 'Tesla demonstrates improved humanoid prototype',
        significance: 'major',
        source: 'https://www.tesla.com/blog/optimus-gen-2',
      },
    ],
  },
  {
    id: 'robotics-household',
    name: 'Household Robots',
    description: 'Robots that perform domestic tasks autonomously',
    domain: 'robotics',
    status: 'in_progress',
    importance: 8,
    tier: 3,
    trl: 4,
    dependencies: ['robotics-humanoid-commercial'],
    keyPlayers: ['Tesla', 'Amazon', 'Samsung'],
    progress: 25,
    yearEstimated: 2028,
    milestones: [
      {
        date: '2021-09-01',
        title: 'Amazon Astro',
        description: 'Amazon announces household robot for monitoring and delivery',
        significance: 'major',
        source: 'https://www.amazon.com/astro',
      },
    ],
  },

  // === AUTONOMOUS VEHICLES (Tier 1-2) ===
  {
    id: 'robotics-self-driving',
    name: 'Self-Driving Vehicles',
    description: 'Fully autonomous road vehicles',
    domain: 'robotics',
    status: 'in_progress',
    importance: 8,
    tier: 2,
    trl: 6,
    dependencies: ['robotics-computer-vision'],
    keyPlayers: ['Waymo', 'Tesla', 'Cruise', 'Zoox'],
    progress: 70,
    progressMetric: 'Miles Driven',
    progressValue: '20M+ miles',
    milestones: [
      {
        date: '2020-10-08',
        title: 'Waymo One Driverless',
        description: 'Waymo opens fully driverless ride-hailing to public in Phoenix',
        significance: 'breakthrough',
        source: 'https://blog.waymo.com/2020/10/waymo-one-driverless.html',
      },
    ],
  },
  {
    id: 'robotics-delivery-drones',
    name: 'Delivery Drones',
    description: 'Autonomous aerial package delivery',
    domain: 'robotics',
    status: 'in_progress',
    importance: 6,
    tier: 2,
    trl: 6,
    keyPlayers: ['Wing', 'Amazon Prime Air', 'Zipline'],
    progress: 55,
    milestones: [
      {
        date: '2019-04-01',
        title: 'Wing FAA Approval',
        description: 'Wing receives first FAA air carrier certification for drone delivery',
        significance: 'major',
        source: 'https://wing.com/company/news/',
      },
    ],
  },

  // === ADVANCED (Tier 3+) ===
  {
    id: 'robotics-swarm',
    name: 'Swarm Robotics',
    description: 'Coordinated multi-robot systems',
    domain: 'robotics',
    status: 'in_progress',
    importance: 7,
    tier: 3,
    trl: 4,
    progress: 35,
    milestones: [
      {
        date: '2014-08-01',
        title: 'Kilobot Swarm',
        description: 'Harvard 1,024-robot swarm demonstrates collective behavior (Science)',
        significance: 'major',
        source: 'https://www.science.org/doi/10.1126/science.1254295',
      },
    ],
  },
  {
    id: 'robotics-self-replicating',
    name: 'Self-Replicating Robots',
    description: 'Robots that can manufacture copies of themselves',
    domain: 'robotics',
    status: 'theoretical',
    importance: 9,
    tier: 4,
    trl: 2,
    dependencies: ['robotics-swarm', 'robotics-dexterous-hands'],
    milestones: [
      {
        date: '2005-05-01',
        title: 'Cornell Self-Replication',
        description: 'Cornell team demonstrates self-replicating robot from modular cubes (Nature)',
        significance: 'major',
        source: 'https://www.nature.com/articles/nature03523',
      },
    ],
  },
];

export default ROBOTICS_NODES;
