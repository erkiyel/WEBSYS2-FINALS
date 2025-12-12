require('dotenv').config();
const path = require('path');
const sequelize = require('../config/database');

const seederFile = process.argv[2];
if (!seederFile) {
  console.error('Usage: node run_single_seeder.js <seeder-filename.js>');
  process.exit(2);
}

(async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const Sequelize = require('sequelize');
    const seederPath = path.join(__dirname, '..', 'seeders', seederFile);
    console.log('Running seeder:', seederFile);
    const seeder = require(seederPath);
    if (seeder && typeof seeder.up === 'function') {
      await seeder.up(queryInterface, Sequelize);
      console.log('Seeder completed:', seederFile);
      process.exit(0);
    } else {
      console.error('No up() function exported by', seederFile);
      process.exit(3);
    }
  } catch (err) {
    console.error('Seeder error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
