require('dotenv').config();
const sequelize = require('../config/database');

(async () => {
  try {
    const result = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;");
    const rows = Array.isArray(result) ? result[0] : result;
    console.log('Public tables:');
    if (!rows || rows.length === 0) {
      console.log('(no tables found)');
    } else {
      console.log(JSON.stringify(rows, null, 2));
      rows.forEach(r => console.log('-', r.table_name || Object.values(r).join(',')));
    }
    process.exit(0);
  } catch (err) {
    console.error('Failed to list tables:', err);
    process.exit(1);
  }
})();
