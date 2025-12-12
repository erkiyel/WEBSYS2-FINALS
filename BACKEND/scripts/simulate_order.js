require('dotenv').config();
const db = require('../models');

(async () => {
  try {
    console.log('Finding a customer user...');
    const customer = await db.User.findOne({ where: { role: 'Customer' } });
    if (!customer) {
      console.error('No customer user found in DB');
      process.exit(2);
    }

    console.log('Using customer:', customer.user_id, customer.username);

    // find some available shop inventory items
    const invItems = await db.ShopInventory.findAll({ where: { quantity: { [db.Sequelize.Op.gt]: 0 } }, limit: 3 });
    if (!invItems || invItems.length === 0) {
      console.error('No shop inventory items with quantity > 0');
      process.exit(2);
    }

    const items = invItems.map(it => ({ shop_inventory_id: it.shop_inventory_id, quantity: 1 }));
    console.log('Attempting to create order items:', items);

    // replicate route logic inside transaction
    const totalAmount = invItems.reduce((sum, it) => sum + parseFloat(it.selling_price), 0);

    const result = await db.sequelize.transaction(async (t) => {
      const order = await db.Order.create({
        customer_id: customer.user_id,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        status: 'Pending'
      }, { transaction: t });

      for (const it of items) {
        await db.OrderItem.create({ order_id: order.order_id, shop_inventory_id: it.shop_inventory_id, quantity: it.quantity, unit_price: (await db.ShopInventory.findByPk(it.shop_inventory_id)).selling_price }, { transaction: t });
      }

      return await db.Order.findByPk(order.order_id, { include: [{ model: db.OrderItem, as: 'OrderItems', include: [{ model: db.ShopInventory, include: [{ model: db.Scroll }] }] }], transaction: t });
    });

    console.log('Simulated order created:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Simulation error:', err && err.message ? err.message : err);
    if (err && err.errors) console.error('Sequelize errors:', err.errors);
    process.exit(1);
  }
})();
