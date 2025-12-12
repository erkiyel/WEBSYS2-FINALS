require('dotenv').config();
// Load models which will attach themselves to the configured Sequelize instance
const db = require('../models');

(async () => {
  try {
    console.log('Connecting to database and syncing models...');
    await db.sequelize.sync({ alter: true });
    console.log('Database sync complete.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err);
    process.exit(1);
  }
})();
