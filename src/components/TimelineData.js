// Timeline data with events from recent past to 2030
const timelineData = {
  timeRange: {
    start: 2020,
    end: 2030
  },
  categories: [
    { id: 'tech', name: 'Technology', color: '#4285F4' },
    { id: 'science', name: 'Science', color: '#34A853' },
    { id: 'society', name: 'Society', color: '#FBBC05' },
    { id: 'environment', name: 'Environment', color: '#EA4335' },
    { id: 'ai', name: 'Artificial Intelligence', color: '#8F44AD' }
  ],
  events: [
    // 2020-2021 (Recent Past)
    {
      id: 1,
      year: 2020,
      month: 3,
      title: "COVID-19 Pandemic",
      description: "Global pandemic that accelerated digital transformation and remote work adoption",
      category: 'society',
      importance: 9
    },
    {
      id: 2,
      year: 2020,
      month: 7,
      title: "GPT-3 Released",
      description: "OpenAI releases GPT-3, demonstrating unprecedented natural language processing capabilities",
      category: 'ai',
      importance: 7
    },
    {
      id: 3,
      year: 2021, 
      month: 4,
      title: "First Successful Helicopter Flight on Mars",
      description: "NASA's Ingenuity helicopter makes the first powered, controlled flight on another planet",
      category: 'science',
      importance: 6
    },
    {
      id: 4,
      year: 2021,
      month: 11,
      title: "Metaverse Announced",
      description: "Facebook rebrands to Meta and announces focus on building the metaverse",
      category: 'tech',
      importance: 7
    },

    // 2022-2023 (Present)
    {
      id: 5,
      year: 2022,
      month: 3,
      title: "Web3 Emergence",
      description: "Rise of Web3 technologies, including blockchain applications beyond cryptocurrency",
      category: 'tech',
      importance: 6
    },
    {
      id: 6,
      year: 2022,
      month: 11,
      title: "ChatGPT Launch",
      description: "OpenAI releases ChatGPT, bringing advanced AI conversation capabilities to the mainstream",
      category: 'ai',
      importance: 8
    },
    {
      id: 7,
      year: 2023,
      month: 6,
      title: "Advanced Generative AI",
      description: "Widespread adoption of generative AI for images, video, and code",
      category: 'ai',
      importance: 8
    },
    {
      id: 8,
      year: 2023,
      month: 9,
      title: "Climate Action Acceleration",
      description: "Intensified global efforts to address climate change following extreme weather events",
      category: 'environment',
      importance: 7
    },

    // 2024-2025 (Near Future)
    {
      id: 9,
      year: 2024,
      month: 3,
      title: "AI Regulation Framework",
      description: "Implementation of first comprehensive global AI regulation and ethics framework",
      category: 'ai',
      importance: 8
    },
    {
      id: 10,
      year: 2024,
      month: 9,
      title: "Commercial Quantum Computing",
      description: "First commercially viable quantum computers reach the market",
      category: 'tech',
      importance: 9
    },
    {
      id: 11,
      year: 2025,
      month: 2,
      title: "Artificial General Intelligence Milestone",
      description: "First AI system demonstrating capabilities across multiple domains at human-expert level",
      category: 'ai',
      importance: 10
    },
    {
      id: 12,
      year: 2025,
      month: 7,
      title: "Advanced Brain-Computer Interfaces",
      description: "Non-invasive brain-computer interfaces enable direct mental control of devices",
      category: 'tech',
      importance: 8
    },

    // 2026-2027 (Mid Future)
    {
      id: 13,
      year: 2026,
      month: 4,
      title: "Autonomous Transportation Networks",
      description: "First cities implement fully autonomous transportation networks",
      category: 'tech',
      importance: 7
    },
    {
      id: 14,
      year: 2026,
      month: 11,
      title: "Fusion Energy Breakthrough",
      description: "Commercial fusion reactor achieves net positive energy production",
      category: 'science',
      importance: 10
    },
    {
      id: 15,
      year: 2027,
      month: 3,
      title: "Digital Twin Cities",
      description: "Major cities implement comprehensive digital twins for urban planning and management",
      category: 'tech',
      importance: 6
    },
    {
      id: 16,
      year: 2027,
      month: 8,
      title: "Bioprinted Organs",
      description: "First successful transplants of complex 3D-printed organs",
      category: 'science',
      importance: 9
    },

    // 2028-2030 (Extended Future)
    {
      id: 17,
      year: 2028,
      month: 1,
      title: "Lunar Colony",
      description: "Establishment of first permanent human colony on the Moon",
      category: 'science',
      importance: 10
    },
    {
      id: 18,
      year: 2028,
      month: 9,
      title: "Climate Restoration Projects",
      description: "Large-scale carbon capture and climate restoration projects show measurable success",
      category: 'environment',
      importance: 9
    },
    {
      id: 19,
      year: 2029,
      month: 5,
      title: "Neural Network Human Augmentation",
      description: "Widespread adoption of neural augmentation for enhanced cognitive capabilities",
      category: 'tech',
      importance: 8
    },
    {
      id: 20,
      year: 2030,
      month: 2,
      title: "Mars Mission Launch",
      description: "First crewed mission departs for Mars",
      category: 'science',
      importance: 10
    },
    {
      id: 21,
      year: 2030,
      month: 11,
      title: "Global Renewable Energy Transition",
      description: "Majority of global energy production shifts to renewable sources",
      category: 'environment',
      importance: 9
    }
  ]
};

export default timelineData; 