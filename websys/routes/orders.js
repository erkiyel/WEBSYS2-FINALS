const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { isSeller } = require('../middleware/roles');

// Get all orders for seller
router.get('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.User,
          as: 'customer',
          attributes: ['user_id', 'username', 'email']
        },
        {
          model: db.OrderItem,
          include: [{
            model: db.ShopInventory,
            include: [{ model: db.Scroll }]
          }]
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get user's own orders
router.get('/my-orders', isAuthenticated, async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      where: { customer_id: req.user.user_id },
      include: [{
        model: db.OrderItem,
        include: [{
          model: db.ShopInventory,
          include: [{ model: db.Scroll }]
        }]
      }],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Error fetching your orders' });
  }
});

// Get single order
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'customer',
          attributes: ['user_id', 'username', 'email']
        },
        {
          model: db.OrderItem,
          include: [{
            model: db.ShopInventory,
            include: [{ model: db.Scroll }]
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.role !== 'Seller' && order.customer_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Create new order
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const shopItem = await db.ShopInventory.findByPk(item.shop_inventory_id);

      if (!shopItem) {
        return res.status(404).json({ 
          error: `Item with ID ${item.shop_inventory_id} not found` 
        });
      }

      if (shopItem.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for item ${item.shop_inventory_id}`,
          available: shopItem.quantity
        });
      }

      const itemTotal = parseFloat(shopItem.selling_price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        shop_inventory_id: item.shop_inventory_id,
        quantity: item.quantity,
        unit_price: shopItem.selling_price,
        shopItem: shopItem
      });
    }

    const order = await db.Order.create({
      customer_id: req.user.user_id,
      total_amount: totalAmount,
      status: 'Pending'
    });

    for (const item of orderItems) {
      await db.OrderItem.create({
        order_id: order.order_id,
        shop_inventory_id: item.shop_inventory_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      });

      item.shopItem.quantity -= item.quantity;
      await item.shopItem.save();
    }

    const completeOrder = await db.Order.findByPk(order.order_id, {
      include: [{
        model: db.OrderItem,
        include: [{
          model: db.ShopInventory,
          include: [{ model: db.Scroll }]
        }]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

router.put('/:id/status', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await db.Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

module.exports = router;