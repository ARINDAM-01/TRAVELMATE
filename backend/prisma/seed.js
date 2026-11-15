const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const destinations = [
  {
    name: 'Paris', country: 'France', city: 'Paris',
    description: 'The City of Light, world-renowned for art, gastronomy, fashion, and culture. Home to the Eiffel Tower, the Louvre, and romantic Seine river cruises.',
    latitude: 48.8566, longitude: 2.3522,
    estimatedBudgetPerDay: 150, currency: 'EUR',
    category: 'city', tags: ['romantic', 'cultural', 'food', 'art', 'historic'], isPopular: true,
  },
  {
    name: 'Tokyo', country: 'Japan', city: 'Tokyo',
    description: 'A vibrant metropolis blending ultra-modern skyscrapers and neon signs with historic Buddhist temples, serene gardens, and Michelin-starred dining.',
    latitude: 35.6762, longitude: 139.6503,
    estimatedBudgetPerDay: 120, currency: 'USD',
    category: 'city', tags: ['cultural', 'food', 'technology', 'historic'], isPopular: true,
  },
  {
    name: 'Bali', country: 'Indonesia', city: 'Denpasar',
    description: 'Island of the Gods featuring lush volcanic mountains, iconic rice paddies, pristine surf beaches, and deeply spiritual Hindu culture.',
    latitude: -8.3405, longitude: 115.0920,
    estimatedBudgetPerDay: 60, currency: 'USD',
    category: 'beach', tags: ['beach', 'spiritual', 'nature', 'adventure', 'wellness'], isPopular: true,
  },
  {
    name: 'New York City', country: 'USA', city: 'New York',
    description: 'The premier global cultural hub, renowned for Broadway theatre, Central Park, world-class art institutions, and iconic skyline architecture.',
    latitude: 40.7128, longitude: -74.0060,
    estimatedBudgetPerDay: 200, currency: 'USD',
    category: 'city', tags: ['urban', 'cultural', 'food', 'shopping', 'nightlife'], isPopular: true,
  },
  {
    name: 'Rome', country: 'Italy', city: 'Rome',
    description: 'The Eternal City with nearly three millennia of globally influential art, architecture, and culture on display, including the Colosseum and Vatican City.',
    latitude: 41.9028, longitude: 12.4964,
    estimatedBudgetPerDay: 130, currency: 'EUR',
    category: 'cultural', tags: ['historical', 'cultural', 'food', 'architecture'], isPopular: true,
  },
  {
    name: 'Barcelona', country: 'Spain', city: 'Barcelona',
    description: 'Catalonian capital famous for Antoni Gaudí\'s fantastical architectural landmarks, Mediterranean beaches, lively tapas bars, and rich history.',
    latitude: 41.3851, longitude: 2.1734,
    estimatedBudgetPerDay: 110, currency: 'EUR',
    category: 'city', tags: ['cultural', 'beach', 'architecture', 'food'], isPopular: true,
  },
  {
    name: 'Santorini', country: 'Greece', city: 'Fira',
    description: 'One of the Cyclades islands in the Aegean Sea, recognized for whitewashed cubiform houses clinging to rugged cliffs above an underwater caldera.',
    latitude: 36.3932, longitude: 25.4615,
    estimatedBudgetPerDay: 180, currency: 'EUR',
    category: 'beach', tags: ['romantic', 'beach', 'scenic', 'sunset', 'island'], isPopular: true,
  },
  {
    name: 'Machu Picchu', country: 'Peru', city: 'Aguas Calientes',
    description: '15th-century Inca citadel set high in the Andes Mountains above the Urubamba River valley, renowned for sophisticated dry-stone walls and panoramic vistas.',
    latitude: -13.1631, longitude: -72.5450,
    estimatedBudgetPerDay: 80, currency: 'USD',
    category: 'adventure', tags: ['adventure', 'historical', 'nature', 'hiking', 'unesco'], isPopular: false,
  },
  {
    name: 'Queenstown', country: 'New Zealand', city: 'Queenstown',
    description: 'Nestled on the shores of Lake Wakatipu with a dramatic Southern Alps backdrop, renowned as the Southern Hemisphere\'s adventure capital.',
    latitude: -45.0312, longitude: 168.6626,
    estimatedBudgetPerDay: 150, currency: 'NZD',
    category: 'adventure', tags: ['adventure', 'nature', 'skiing', 'mountains'], isPopular: false,
  },
  {
    name: 'Dubai', country: 'UAE', city: 'Dubai',
    description: 'Cosmopolitan destination known for luxury shopping, ultramodern architecture, lively nightlife, and the 830m-tall Burj Khalifa.',
    latitude: 25.2048, longitude: 55.2708,
    estimatedBudgetPerDay: 220, currency: 'AED',
    category: 'city', tags: ['luxury', 'modern', 'shopping', 'desert', 'architecture'], isPopular: true,
  },
];

const attractionsData = {
  'Paris': [
    { name: 'Eiffel Tower', description: 'Iconic 330-meter wrought-iron lattice tower on the Champ de Mars.', category: 'landmark', estimatedCost: 28, currency: 'EUR', estimatedDurationHours: 2.5, latitude: 48.8584, longitude: 2.2945, rating: 4.7, openingHours: '09:00 - 23:45' },
    { name: 'Louvre Museum', description: 'World\'s largest and most visited museum, housing masterpieces including the Mona Lisa.', category: 'museum', estimatedCost: 22, currency: 'EUR', estimatedDurationHours: 4.0, latitude: 48.8606, longitude: 2.3376, rating: 4.8, openingHours: '09:00 - 18:00' },
    { name: 'Notre-Dame Cathedral', description: 'Masterpiece of French Gothic architecture on the Île de la Cité.', category: 'landmark', estimatedCost: 0, currency: 'EUR', estimatedDurationHours: 1.5, latitude: 48.8530, longitude: 2.3499, rating: 4.7, openingHours: '08:00 - 18:45' },
    { name: 'Montmartre & Sacré-Cœur', description: 'Historic hilltop village famous for artists, cobblestone alleys, and the white-domed basilica.', category: 'cultural', estimatedCost: 0, currency: 'EUR', estimatedDurationHours: 3.0, latitude: 48.8867, longitude: 2.3431, rating: 4.6, openingHours: '06:00 - 22:30' },
  ],
  'Tokyo': [
    { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest and most significant ancient Buddhist temple in Asakusa.', category: 'landmark', estimatedCost: 0, currency: 'USD', estimatedDurationHours: 2.0, latitude: 35.7148, longitude: 139.7967, rating: 4.7, openingHours: '06:00 - 17:00' },
    { name: 'Shibuya Crossing & Hachiko', description: 'The famous scramble crossing surrounded by giant video screens and neon advertisements.', category: 'landmark', estimatedCost: 0, currency: 'USD', estimatedDurationHours: 1.0, latitude: 35.6598, longitude: 139.7006, rating: 4.5, openingHours: '24 Hours' },
    { name: 'Meiji Jingu Shrine', description: 'Shinto shrine dedicated to Emperor Meiji, set in a tranquil 170-acre forest.', category: 'landmark', estimatedCost: 0, currency: 'USD', estimatedDurationHours: 2.0, latitude: 35.6764, longitude: 139.6993, rating: 4.7, openingHours: 'Sunrise - Sunset' },
  ],
  'Bali': [
    { name: 'Tanah Lot Temple', description: 'Ancient Hindu pilgrimage temple perched upon a dramatic offshore rock formation.', category: 'landmark', estimatedCost: 5, currency: 'USD', estimatedDurationHours: 2.0, latitude: -8.6213, longitude: 115.0869, rating: 4.6, openingHours: '07:00 - 19:00' },
    { name: 'Tegalalang Rice Terraces', description: 'Iconic emerald-green stepped rice paddies with traditional subak irrigation.', category: 'nature', estimatedCost: 3, currency: 'USD', estimatedDurationHours: 2.5, latitude: -8.4312, longitude: 115.2793, rating: 4.5, openingHours: '08:00 - 18:00' },
    { name: 'Ubud Sacred Monkey Forest', description: 'Sanctuary and natural habitat of the Balinese long-tailed macaque.', category: 'nature', estimatedCost: 6, currency: 'USD', estimatedDurationHours: 2.0, latitude: -8.5188, longitude: 115.2591, rating: 4.4, openingHours: '09:00 - 17:00' },
  ],
  'New York City': [
    { name: 'Central Park', description: '843-acre urban oasis with walking paths, boating lake, zoo, and scenic meadows.', category: 'nature', estimatedCost: 0, currency: 'USD', estimatedDurationHours: 3.5, latitude: 40.7851, longitude: -73.9683, rating: 4.8, openingHours: '06:00 - 01:00' },
    { name: 'Statue of Liberty & Ellis Island', description: 'Colossal neoclassical copper sculpture on Liberty Island, a beacon of freedom.', category: 'landmark', estimatedCost: 25, currency: 'USD', estimatedDurationHours: 4.0, latitude: 40.6892, longitude: -74.0445, rating: 4.7, openingHours: '09:00 - 17:00' },
    { name: 'Metropolitan Museum of Art', description: 'Over 5,000 years of art spanning every corner of the globe.', category: 'museum', estimatedCost: 30, currency: 'USD', estimatedDurationHours: 4.0, latitude: 40.7794, longitude: -73.9632, rating: 4.8, openingHours: '10:00 - 17:00' },
  ],
  'Rome': [
    { name: 'Colosseum', description: 'The largest ancient amphitheatre ever built, hosting gladiator contests.', category: 'landmark', estimatedCost: 18, currency: 'EUR', estimatedDurationHours: 3.0, latitude: 41.8902, longitude: 12.4922, rating: 4.8, openingHours: '08:30 - 19:00' },
    { name: 'Vatican Museums & Sistine Chapel', description: 'Immense collection of classical sculptures and Renaissance masterpieces by Michelangelo.', category: 'museum', estimatedCost: 25, currency: 'EUR', estimatedDurationHours: 4.0, latitude: 41.9065, longitude: 12.4536, rating: 4.8, openingHours: '08:00 - 19:00' },
    { name: 'Trevi Fountain', description: 'High-Baroque marble fountain where tossing a coin guarantees your return to Rome.', category: 'landmark', estimatedCost: 0, currency: 'EUR', estimatedDurationHours: 1.0, latitude: 41.9009, longitude: 12.4833, rating: 4.7, openingHours: '24 Hours' },
  ],
  'Barcelona': [
    { name: 'Basílica de la Sagrada Família', description: 'Antoni Gaudí\'s awe-inspiring unfinished Roman Catholic minor basilica.', category: 'landmark', estimatedCost: 26, currency: 'EUR', estimatedDurationHours: 2.5, latitude: 41.4036, longitude: 2.1744, rating: 4.8, openingHours: '09:00 - 20:00' },
    { name: 'Park Güell', description: 'Privatized park system composed of gardens and architectonic elements located on Carmel Hill.', category: 'landmark', estimatedCost: 10, currency: 'EUR', estimatedDurationHours: 2.0, latitude: 41.4145, longitude: 2.1527, rating: 4.5, openingHours: '09:30 - 19:30' },
  ],
  'Santorini': [
    { name: 'Oia Sunset Village', description: 'Famous village on the northern tip of the caldera, celebrated for breathtaking sunsets.', category: 'nature', estimatedCost: 0, currency: 'EUR', estimatedDurationHours: 3.0, latitude: 36.4618, longitude: 25.3753, rating: 4.9, openingHours: '24 Hours' },
    { name: 'Akrotiri Prehistoric City', description: 'Bronze Age Minoan settlement preserved in volcanic ash following the Thera eruption.', category: 'museum', estimatedCost: 12, currency: 'EUR', estimatedDurationHours: 2.0, latitude: 36.3517, longitude: 25.4027, rating: 4.6, openingHours: '08:30 - 15:30' },
  ],
  'Dubai': [
    { name: 'Burj Khalifa', description: 'The world\'s tallest architectural structure at 828 meters, featuring sky observation decks.', category: 'landmark', estimatedCost: 45, currency: 'AED', estimatedDurationHours: 2.0, latitude: 25.1972, longitude: 55.2744, rating: 4.7, openingHours: '08:30 - 23:00' },
    { name: 'Dubai Mall & Fountain', description: 'Enormous shopping, entertainment, and dining complex with a synchronized fountain show.', category: 'landmark', estimatedCost: 0, currency: 'AED', estimatedDurationHours: 3.5, latitude: 25.1987, longitude: 55.2793, rating: 4.7, openingHours: '10:00 - 00:00' },
  ],
};

async function main() {
  console.log('🌱 Starting TravelMate database seed...');

  console.log('Clearing existing data...');
  await prisma.passwordResetToken.deleteMany();
  await prisma.sharedTrip.deleteMany();
  await prisma.tripNote.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.graphEdge.deleteMany();
  await prisma.graphNode.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating demo users...');
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@travelmate.com',
      name: 'Alex Rivera',
      passwordHash: await bcrypt.hash('Demo123!', 12),
      preferredCurrency: 'USD',
      travelPreferences: ['cultural', 'food', 'adventure'],
      notificationPrefs: { emailUpdates: true, tripReminders: true },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@travelmate.com',
      name: 'System Admin',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      preferredCurrency: 'USD',
    },
  });

  console.log('Creating destinations...');
  const createdDestinations = {};
  for (const dest of destinations) {
    const created = await prisma.destination.create({ data: dest });
    createdDestinations[dest.name] = created;
  }

  console.log('Creating attractions...');
  for (const [destName, attractions] of Object.entries(attractionsData)) {
    const destination = createdDestinations[destName];
    if (destination) {
      for (const attr of attractions) {
        await prisma.attraction.create({
          data: { ...attr, destinationId: destination.id },
        });
      }
    }
  }

  console.log('Creating sample trip...');
  const sampleTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Grand European Discovery',
      description: 'Ten days exploring art, gastronomy, and historic landmarks across Paris and Rome.',
      startLocation: 'London, UK',
      destinations: ['Paris, France', 'Rome, Italy'],
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-20'),
      numTravelers: 2,
      budget: 3500,
      currency: 'EUR',
      travelStyle: 'cultural',
      status: 'planning',
      coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('Creating itinerary days and activities...');
  const day1 = await prisma.itineraryDay.create({
    data: {
      tripId: sampleTrip.id,
      dayNumber: 1,
      date: new Date('2025-05-10'),
      location: 'Paris, France',
      summary: 'Arrival in Paris, check-in, and sunset cruise on the Seine',
      activities: {
        create: [
          { name: 'Hotel Check-in at Le Marais', timeOfDay: 'afternoon', orderIndex: 0, estimatedCost: 0, currency: 'EUR', category: 'accommodation', notes: 'Confirmation #FR-88912' },
          { name: 'Sunset Seine River Cruise', timeOfDay: 'evening', orderIndex: 1, estimatedCost: 35, currency: 'EUR', category: 'activities', description: 'One-hour illuminated river tour starting near Pont Neuf' },
          { name: 'Dinner at Traditional French Bistro', timeOfDay: 'evening', orderIndex: 2, estimatedCost: 65, currency: 'EUR', category: 'food', description: 'Duck confit and tarte tatin in Saint-Germain' },
        ],
      },
    },
  });

  const day2 = await prisma.itineraryDay.create({
    data: {
      tripId: sampleTrip.id,
      dayNumber: 2,
      date: new Date('2025-05-11'),
      location: 'Paris, France',
      summary: 'Iconic landmarks: Louvre Museum and Eiffel Tower',
      activities: {
        create: [
          { name: 'Louvre Museum Tour', timeOfDay: 'morning', orderIndex: 0, estimatedCost: 22, currency: 'EUR', category: 'activities', latitude: 48.8606, longitude: 2.3376, description: 'Pre-booked 09:30 timed entry' },
          { name: 'Stroll through Tuileries Garden & Cafe Lunch', timeOfDay: 'afternoon', orderIndex: 1, estimatedCost: 28, currency: 'EUR', category: 'food' },
          { name: 'Eiffel Tower Summit Access', timeOfDay: 'evening', orderIndex: 2, estimatedCost: 28, currency: 'EUR', category: 'activities', latitude: 48.8584, longitude: 2.2945, description: 'Evening ascent to witness the glittering light show' },
        ],
      },
    },
  });

  console.log('Creating graph nodes and network connections...');
  const nodeCDG = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Paris Charles de Gaulle (CDG)',
      nodeType: 'airport',
      latitude: 49.0097, longitude: 2.5479,
      positionX: 120, positionY: 180,
    },
  });

  const nodeCenter = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Paris City Center',
      nodeType: 'city',
      latitude: 48.8566, longitude: 2.3522,
      positionX: 300, positionY: 220,
    },
  });

  const nodeLouvre = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Louvre Museum',
      nodeType: 'attraction',
      latitude: 48.8606, longitude: 2.3376,
      positionX: 420, positionY: 160,
    },
  });

  const nodeEiffel = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Eiffel Tower',
      nodeType: 'attraction',
      latitude: 48.8584, longitude: 2.2945,
      positionX: 250, positionY: 340,
    },
  });

  const nodeHotel = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Le Marais Boutique Hotel',
      nodeType: 'hotel',
      latitude: 48.8588, longitude: 2.3598,
      positionX: 460, positionY: 280,
    },
  });

  // Graph Edges
  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeCDG.id,
      targetId: nodeCenter.id,
      edgeType: 'railway',
      distance: 34.0, duration: 45.0,
      transportMode: 'RER B Train',
      estimatedCost: 11.8, currency: 'EUR',
      weight: 45.0,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeCenter.id,
      targetId: nodeLouvre.id,
      edgeType: 'walking',
      distance: 1.2, duration: 15.0,
      transportMode: 'Walking',
      estimatedCost: 0, currency: 'EUR',
      weight: 15.0,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeCenter.id,
      targetId: nodeEiffel.id,
      edgeType: 'road',
      distance: 4.8, duration: 25.0,
      transportMode: 'Metro Line 8',
      estimatedCost: 2.15, currency: 'EUR',
      weight: 25.0,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeCenter.id,
      targetId: nodeHotel.id,
      edgeType: 'walking',
      distance: 0.8, duration: 10.0,
      transportMode: 'Walking',
      estimatedCost: 0, currency: 'EUR',
      weight: 10.0,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeLouvre.id,
      targetId: nodeHotel.id,
      edgeType: 'walking',
      distance: 1.5, duration: 20.0,
      transportMode: 'Walking',
      estimatedCost: 0, currency: 'EUR',
      weight: 20.0,
    },
  });

  console.log('Creating sample expenses...');
  await prisma.expense.createMany({
    data: [
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'transportation', title: 'Eurostar London to Paris', amount: 240, currency: 'EUR', isEstimated: false, date: new Date('2025-05-10') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'accommodation', title: 'Paris Hotel Deposit', amount: 650, currency: 'EUR', isEstimated: false, date: new Date('2025-05-10') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'activities', title: 'Museum & Attraction Passes', amount: 160, currency: 'EUR', isEstimated: true, date: new Date('2025-05-11') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'food', title: 'Dining Budget Allocation', amount: 500, currency: 'EUR', isEstimated: true, date: new Date('2025-05-12') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'shopping', title: 'Souvenirs & Gifts', amount: 120, currency: 'EUR', isEstimated: true, date: new Date('2025-05-13') },
    ],
  });

  console.log('Creating favorites...');
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      destinationId: createdDestinations['Santorini'].id,
    },
  });
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      destinationId: createdDestinations['Tokyo'].id,
    },
  });

  console.log('Creating sample trip note...');
  await prisma.tripNote.create({
    data: {
      tripId: sampleTrip.id,
      userId: demoUser.id,
      content: 'Don\'t forget to validate Metro tickets at the automated turnstiles and carry universal EU plug adapters.',
    },
  });

  console.log('Creating trip share link...');
  await prisma.sharedTrip.create({
    data: {
      tripId: sampleTrip.id,
      isPublic: true,
      allowEdit: false,
    },
  });

  console.log('\n=========================================');
  console.log('✅ TravelMate Database Seed Complete!');
  console.log('=========================================');
  console.log('Demo Credentials:');
  console.log('  Email:    demo@travelmate.com');
  console.log('  Password: Demo123!');
  console.log('=========================================\n');
}

module.exports = { seedDatabase: main };

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
