// Customer orders to Seller
const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { isSeller } = require('../middleware/roles');

router.get('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }

    const orders = await db.Order.findAll({
      where: whereClause,
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

router.get('/detail/:id', isAuthenticated, isSeller, async (req, res) => {
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
            include: [
              { model: db.Scroll },
              { model: db.Specialist }
            ]
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

router.put('/:id/accept', isAuthenticated, isSeller, async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [{
        model: db.OrderItem,
        include: [{ model: db.ShopInventory }]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Can only accept pending orders' });
    }

    for (const item of order.OrderItems) {
      if (item.ShopInventory.quantity < item.quantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock to fulfill order',
          item_id: item.shop_inventory_id,
          available: item.ShopInventory.quantity,
          requested: item.quantity
        });
      }
    }

    for (const item of order.OrderItems) {
      item.ShopInventory.quantity -= item.quantity;
      await item.ShopInventory.save();
    }

    order.status = 'Completed';
    await order.save();

    res.json({
      message: 'Order accepted and completed. Stock has been reduced.',
      order
    });

  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ error: 'Error accepting order' });
  }
});

router.put('/:id/decline', isAuthenticated, isSeller, async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Can only decline pending orders' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({
      message: 'Order declined',
      order
    });

  } catch (error) {
    console.error('Error declining order:', error);
    res.status(500).json({ error: 'Error declining order' });
  }
});


router.get('/my-orders', isAuthenticated, async (req, res) => {
  try {
    const { status } = req.query;
    let whereClause = { customer_id: req.user.user_id };
    
    if (status) {
      whereClause.status = status;
    }

    const orders = await db.Order.findAll({
      where: whereClause,
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

router.get('/my-orders/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await db.Order.findOne({
      where: { 
        order_id: req.params.id,
        customer_id: req.user.user_id
      },
      include: [{
        model: db.OrderItem,
        include: [{
          model: db.ShopInventory,
          include: [
            { model: db.Scroll },
            { model: db.Specialist }
          ]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'Customer') {
      return res.status(403).json({ error: 'Only customers can place orders' });
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const shopItem = await db.ShopInventory.findByPk(item.shop_inventory_id, {
        include: [{ model: db.Scroll }]
      });

      if (!shopItem) {
        return res.status(404).json({ 
          error: `Item with ID ${item.shop_inventory_id} not found` 
        });
      }

      if (shopItem.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${shopItem.Scroll.scroll_name}`,
          available: shopItem.quantity
        });
      }

      const itemTotal = parseFloat(shopItem.selling_price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        shop_inventory_id: item.shop_inventory_id,
        quantity: item.quantity,
        unit_price: shopItem.selling_price
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
        ...item
      });
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
      message: 'Order placed successfully. Waiting for seller approval.',
      order: completeOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Cancel my order
router.put('/my-orders/:id/cancel', isAuthenticated, async (req, res) => {
  try {
    const order = await db.Order.findOne({
      where: { 
        order_id: req.params.id,
        customer_id: req.user.user_id
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ 
        error: 'Can only cancel pending orders' 
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Error cancelling order' });
  }
});

module.exports = router;