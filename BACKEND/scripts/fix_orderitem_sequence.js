require('dotenv').config();
const sequelize = require('../config/database');

(async () => {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    console.log('Connected. Creating sequence and setting defaults for OrderItems.order_item_id');

    const seqName = 'orderitems_order_item_id_seq';
    const cmds = [
      `CREATE SEQUENCE IF NOT EXISTS ${seqName};`,
      `SELECT setval('${seqName}', COALESCE((SELECT MAX(order_item_id) FROM "OrderItems"),0)+1, false);`,
      `ALTER TABLE "OrderItems" ALTER COLUMN order_item_id SET DEFAULT nextval('${seqName}');`
    ];

    for (const c of cmds) {
      try {
        const res = await sequelize.query(c);
        console.log('Executed:', c.split('\n')[0]);
      } catch (e) {
        console.error('Error executing:', c, e.message || e);
      }
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message || err);
    process.exit(1);
  }
})();