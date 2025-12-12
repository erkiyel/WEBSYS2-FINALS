require('dotenv').config();
const db = require('../config/database');

const table = process.argv[2];
if (!table) {
  console.error('Usage: node inspect_columns.js <TableName>');
  process.exit(2);
}

(async () => {
  try {
    const sql = `SELECT column_name,data_type,numeric_precision,numeric_scale FROM information_schema.columns WHERE table_name='${table}' ORDER BY ordinal_position;`;
    const [rows] = await db.query(sql);
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
