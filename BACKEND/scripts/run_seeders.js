require('dotenv').config();
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');

async function run() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const Sequelize = require('sequelize');

    const seedDir = path.join(__dirname, '..', 'seeders');
    const files = fs.readdirSync(seedDir).filter(f => f.endsWith('.js')).sort();

    for (const file of files) {
      const seederPath = path.join(seedDir, file);
      console.log('Running seeder:', file);
      const seeder = require(seederPath);
      if (seeder && typeof seeder.up === 'function') {
        try {
          await seeder.up(queryInterface, Sequelize);
          console.log('Seeded:', file);
        } catch (err) {
          console.warn('Seeder failed (continuing):', file, err.message || err);
        }
      } else {
        console.log('Skipping (no up):', file);
      }
    }

    console.log('All seeders executed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
