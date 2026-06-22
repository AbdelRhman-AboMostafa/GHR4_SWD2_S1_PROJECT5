// Planner Service - Service layer for future API integration
// Currently uses mock data, ready to swap with real APIs

const mockDestinations = [
  { id: 1, name: "Paris", country: "France", bestMonths: "April-October", type: "city" },
  { id: 2, name: "Barcelona", country: "Spain", bestMonths: "May-September", type: "city" },
  { id: 3, name: "Tokyo", country: "Japan", bestMonths: "March-May, September-November", type: "city" },
  { id: 4, name: "Bali", country: "Indonesia", bestMonths: "April-October", type: "beach" },
  { id: 5, name: "Maldives", country: "Maldives", bestMonths: "November-April", type: "beach" },
  { id: 6, name: "New York", country: "USA", bestMonths: "April-June, September-November", type: "city" },
  { id: 7, name: "Santorini", country: "Greece", bestMonths: "May-October", type: "beach" },
  { id: 8, name: "Rome", country: "Italy", bestMonths: "April-June, September-October", type: "city" },
  { id: 9, name: "Dubai", country: "UAE", bestMonths: "November-March", type: "city" },
  { id: 10, name: "Phuket", country: "Thailand", bestMonths: "November-February", type: "beach" },
];

const mockHotels = {
  "Paris": [
    "Hotel Le Marais",
    "The Ritz Paris",
    "CitizenM Paris",
    "Hotel des Arts Montmartre",
  ],
  "Barcelona": [
    "Hotel Example",
    "Casa Bonay",
    "Hotel Arts Barcelona",
    "The Wittmore",
  ],
  "Tokyo": [
    "Park Hyatt Tokyo",
    "Aman Tokyo",
    "The Celestine Ginza",
    "Hotel Gracery Shinjuku",
  ],
  "Bali": [
    "Four Seasons Bali",
    "Alila Villas Uluwatu",
    "The Mulia Bali",
    "COMO Uma Ubud",
  ],
  "Maldives": [
    "Soneva Fushi",
    "Gili Lankanfushi",
    "Four Seasons Maldives",
    "Conrad Maldives",
  ],
  "New York": [
    "The Plaza",
    "Park Lane Hotel",
    "1 Hotel Brooklyn Bridge",
    "The Standard",
  ],
  "Santorini": [
    "Canaves Oia",
    "Katikies Hotel",
    "Grace Hotel Santorini",
    "Mystique Santorini",
  ],
  "Rome": [
    "Hotel de Russie",
    "The First Roma Dolce",
    "Hotel Artemide",
    "J.K. Place Roma",
  ],
  "Dubai": [
    "Burj Al Arab",
    "Atlantis The Palm",
    "Address Downtown",
    "Raffles Dubai",
  ],
  "Phuket": [
    "The Naka Island",
    "Banyan Tree Phuket",
    "Trisara Phuket",
    "Sri Panwa Phuket",
  ],
};

const mockLandmarks = {
  "Paris": [
    "Eiffel Tower",
    "Louvre Museum",
    "Notre-Dame Cathedral",
    "Champs-Élysées",
  ],
  "Barcelona": [
    "Sagrada Familia",
    "Park Güell",
    "La Rambla",
    "Gothic Quarter",
  ],
  "Tokyo": [
    "Senso-ji Temple",
    "Shibuya Crossing",
    "Tokyo Skytree",
    "Meiji Shrine",
  ],
  "Bali": [
    "Tanah Lot Temple",
    "Ubud Monkey Forest",
    "Tegallalang Rice Terraces",
    "Uluwatu Temple",
  ],
  "Maldives": [
    "Underwater Restaurant",
    "Snorkeling at Banana Reef",
    "Sunset Cruise",
    "Island Hopping",
  ],
  "New York": [
    "Statue of Liberty",
    "Central Park",
    "Times Square",
    "Empire State Building",
  ],
  "Santorini": [
    "Oia Sunset",
    "Red Beach",
    "Ancient Thera",
    "Fira Town",
  ],
  "Rome": [
    "Colosseum",
    "Vatican City",
    "Trevi Fountain",
    "Roman Forum",
  ],
  "Dubai": [
    "Burj Khalifa",
    "Dubai Mall",
    "Palm Jumeirah",
    "Dubai Marina",
  ],
  "Phuket": [
    "Phi Phi Islands",
    "Big Buddha",
    "Old Phuket Town",
    "Patong Beach",
  ],
};

export const plannerService = {
  // Get all destinations
  getDestinations: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDestinations;
  },

  // Get destinations by type
  getDestinationsByType: async (type) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDestinations.filter((d) => d.type === type);
  },

  // Get hotels for a destination
  getHotels: async (destination) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockHotels[destination] || [];
  },

  // Get landmarks for a destination
  getLandmarks: async (destination) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockLandmarks[destination] || [];
  },

  // Get destination details
  getDestinationDetails: async (destinationName) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDestinations.find((d) => d.name === destinationName) || null;
  },
};
