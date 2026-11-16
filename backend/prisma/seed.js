const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { CURATED_STATE_DESTINATIONS } = require('../src/services/indiaTravelData');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TravelMate India database seed...');

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
      name: 'Aarav Sharma',
      passwordHash: await bcrypt.hash('Demo123!', 12),
      preferredCurrency: 'INR',
      travelPreferences: ['heritage', 'hill_station', 'food', 'spiritual'],
      notificationPrefs: { emailUpdates: true, tripReminders: true },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@travelmate.com',
      name: 'System Admin',
      passwordHash: await bcrypt.hash('Admin123!', 12),
      preferredCurrency: 'INR',
    },
  });

  console.log('Seeding India State destinations & attractions...');
  const createdDestinations = {};
  for (const [stateName, destList] of Object.entries(CURATED_STATE_DESTINATIONS)) {
    for (const d of destList) {
      const { attractions, ...destData } = d;
      const created = await prisma.destination.create({
        data: {
          ...destData,
          attractions: {
            create: (attractions || []).map(a => ({
              ...a,
              currency: 'INR',
            })),
          },
        },
      });
      createdDestinations[d.name] = created;
    }
  }

  console.log('Creating sample India trip (Royal Rajasthan Heritage Trail)...');
  const sampleTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Royal Rajasthan Heritage Expedition',
      description: 'A 7-day royal voyage exploring grand Rajput forts, desert sunsets, and white marble palaces across Jaipur and Udaipur.',
      startLocation: 'New Delhi, India',
      destinations: ['Jaipur, Rajasthan', 'Udaipur, Rajasthan'],
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-11-27'),
      numTravelers: 2,
      budget: 45000,
      currency: 'INR',
      travelStyle: 'cultural',
      status: 'planning',
      coverImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('Creating itinerary days and activities in INR...');
  const day1 = await prisma.itineraryDay.create({
    data: {
      tripId: sampleTrip.id,
      dayNumber: 1,
      date: new Date('2026-11-20'),
      location: 'Jaipur, Rajasthan',
      summary: 'Arrival in Pink City, check-in at heritage haveli, and evening market stroll at Johari Bazaar',
      activities: {
        create: [
          { name: 'Check-in at Heritage Haveli', timeOfDay: 'afternoon', orderIndex: 0, estimatedCost: 0, currency: 'INR', category: 'accommodation', notes: 'Welcome drink with traditional Rajasthani folk music' },
          { name: 'Johari Bazaar & Bapu Bazaar Stroll', timeOfDay: 'evening', orderIndex: 1, estimatedCost: 1500, currency: 'INR', category: 'shopping', description: 'Explore handcrafted blue pottery, bandhani textiles, and silver jewelry' },
          { name: 'Traditional Rajasthani Thali Dinner', timeOfDay: 'evening', orderIndex: 2, estimatedCost: 1200, currency: 'INR', category: 'food', description: 'Authentic Dal Baati Churma, Gatte ki Sabzi, and Ker Sangri at Chokhi Dhani' },
        ],
      },
    },
  });

  const day2 = await prisma.itineraryDay.create({
    data: {
      tripId: sampleTrip.id,
      dayNumber: 2,
      date: new Date('2026-11-21'),
      location: 'Jaipur, Rajasthan',
      summary: 'Grand Amer Fort, Hawa Mahal, and sunset at Nahargarh Fort',
      activities: {
        create: [
          { name: 'Amer Fort Exploration', timeOfDay: 'morning', orderIndex: 0, estimatedCost: 200, currency: 'INR', category: 'activities', latitude: 26.9855, longitude: 75.8513, description: 'Explore Sheesh Mahal (Mirror Palace) and royal courtyards overlooking Maota Lake' },
          { name: 'Hawa Mahal & City Palace Tour', timeOfDay: 'afternoon', orderIndex: 1, estimatedCost: 350, currency: 'INR', category: 'activities', latitude: 26.9239, longitude: 75.8267, description: 'Photograph 953 jharokhas and visit the royal costume gallery' },
          { name: 'Sunset over Aravallis at Nahargarh', timeOfDay: 'evening', orderIndex: 2, estimatedCost: 50, currency: 'INR', category: 'activities', latitude: 26.9378, longitude: 75.8155, description: 'Watch the entire Pink City glow in twilight shades of orange and gold' },
        ],
      },
    },
  });

  console.log('Creating travel network graph nodes & edges (India Spatial Map)...');
  const nodeDelhi = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'New Delhi (IGI Airport / NDLS)',
      nodeType: 'airport',
      latitude: 28.5562, longitude: 77.1000,
      positionX: 150, positionY: 100,
      metadata: { city: 'Delhi', transport: 'Airport & Central Hub' },
    },
  });

  const nodeJaipur = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Jaipur (Pink City)',
      nodeType: 'city',
      latitude: 26.9124, longitude: 75.7873,
      positionX: 280, positionY: 220,
      metadata: { state: 'Rajasthan', highlights: 'Amer Fort, Hawa Mahal' },
    },
  });

  const nodeAmer = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Amer Fort',
      nodeType: 'attraction',
      latitude: 26.9855, longitude: 75.8513,
      positionX: 380, positionY: 170,
    },
  });

  const nodeJodhpur = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Jodhpur (Blue City)',
      nodeType: 'city',
      latitude: 26.2389, longitude: 73.0243,
      positionX: 180, positionY: 340,
    },
  });

  const nodeUdaipur = await prisma.graphNode.create({
    data: {
      tripId: sampleTrip.id,
      name: 'Udaipur (City of Lakes)',
      nodeType: 'city',
      latitude: 24.5854, longitude: 73.7125,
      positionX: 310, positionY: 420,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeDelhi.id,
      targetId: nodeJaipur.id,
      edgeType: 'railway',
      distance: 268,
      duration: 3.5,
      transportMode: 'Vande Bharat Express',
      estimatedCost: 1250,
      currency: 'INR',
      weight: 268,
      isDirected: false,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeJaipur.id,
      targetId: nodeAmer.id,
      edgeType: 'road',
      distance: 11,
      duration: 0.5,
      transportMode: 'Cab / Auto',
      estimatedCost: 250,
      currency: 'INR',
      weight: 11,
      isDirected: false,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeJaipur.id,
      targetId: nodeJodhpur.id,
      edgeType: 'railway',
      distance: 334,
      duration: 4.5,
      transportMode: 'Express Train',
      estimatedCost: 850,
      currency: 'INR',
      weight: 334,
      isDirected: false,
    },
  });

  await prisma.graphEdge.create({
    data: {
      tripId: sampleTrip.id,
      sourceId: nodeJodhpur.id,
      targetId: nodeUdaipur.id,
      edgeType: 'road',
      distance: 250,
      duration: 5.0,
      transportMode: 'Scenic Highway Drive via Ranakpur',
      estimatedCost: 3500,
      currency: 'INR',
      weight: 250,
      isDirected: false,
    },
  });

  console.log('Creating sample trip expenses in INR...');
  await prisma.expense.createMany({
    data: [
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'transportation', title: 'Vande Bharat Express Delhi-Jaipur', amount: 2500, currency: 'INR', isEstimated: false, date: new Date('2026-11-20') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'accommodation', title: 'Jaipur Heritage Haveli (3 Nights)', amount: 12000, currency: 'INR', isEstimated: false, date: new Date('2026-11-20') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'activities', title: 'Amer Fort & City Palace Composite Tickets', amount: 1100, currency: 'INR', isEstimated: false, date: new Date('2026-11-21') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'food', title: 'Rajasthani Dining & Chokhi Dhani', amount: 4500, currency: 'INR', isEstimated: true, date: new Date('2026-11-22') },
      { tripId: sampleTrip.id, userId: demoUser.id, category: 'shopping', title: 'Blue Pottery & Traditional Textiles', amount: 3200, currency: 'INR', isEstimated: true, date: new Date('2026-11-23') },
    ],
  });

  console.log('Creating favorites...');
  if (createdDestinations['Udaipur']) {
    await prisma.favorite.create({
      data: {
        userId: demoUser.id,
        destinationId: createdDestinations['Udaipur'].id,
      },
    });
  }
  if (createdDestinations['Munnar']) {
    await prisma.favorite.create({
      data: {
        userId: demoUser.id,
        destinationId: createdDestinations['Munnar'].id,
      },
    });
  }

  console.log('Creating sample trip note...');
  await prisma.tripNote.create({
    data: {
      tripId: sampleTrip.id,
      userId: demoUser.id,
      content: 'Carry UPI payment app (Google Pay / PhonePe) which is accepted everywhere across India, even at roadside stalls.',
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
  console.log('✅ TravelMate India Database Seed Complete!');
  console.log('=========================================');
  console.log('Demo Credentials:');
  console.log('  Email:    demo@travelmate.com');
  console.log('  Password: Demo123!');
  console.log('  Currency: INR (₹)');
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
