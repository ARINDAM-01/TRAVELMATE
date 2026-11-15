const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`\n🚀 TravelMate Backend Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 Port:        ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend:    ${config.frontendUrl}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Check and auto-seed if database is unseeded
  (async () => {
    try {
      const { prisma } = require('./config/database');
      const destCount = await prisma.destination.count();
      if (destCount === 0) {
        console.log('🌱 Database has no destinations, seeding demo data...');
        const { seedDatabase } = require('../prisma/seed');
        await seedDatabase();
        console.log('✅ Auto-seed completed successfully!');
      }
    } catch (err) {
      console.warn('⚠️ Auto-seed check skipped or failed:', err.message);
    }
  })();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
