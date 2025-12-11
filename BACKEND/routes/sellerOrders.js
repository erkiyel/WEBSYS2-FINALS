const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { isSeller, isSpecialist } = require('../middleware/roles');

// ==================== SELLER ENDPOINTS ====================

// Get all seller orders (Seller only)
router.get('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { status } = req.query;
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }

    const orders = await db.SellerOrder.findAll({
      where: whereClause,
      include: [
        {
          model: db.Specialist,
          include: [
            { model: db.User, attributes: ['username', 'email'] },
            { model: db.Element, as: 'specialtyElement' }
          ]
        },
        {
          model: db.SellerOrderItem,
          include: [{
            model: db.SpecialistInventory,
            include: [{ model: db.Scroll }]
          }]
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get single seller order (Seller only)
router.get('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const order = await db.SellerOrder.findByPk(req.params.id, {
      include: [
        {
          model: db.Specialist,
          include: [
            { model: db.User, attributes: ['username', 'email'] },
            { model: db.Element, as: 'specialtyElement' }
          ]
        },
        {
          model: db.SellerOrderItem,
          include: [{
            model: db.SpecialistInventory,
            include: [{ model: db.Scroll }]
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching seller order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Create order to specialist (Seller only)
router.post('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { specialist_id, items } = req.body;
    // items: [{ inventory_id, quantity }]

    if (!specialist_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Specialist ID and items are required' });
    }

    const specialist = await db.Specialist.findByPk(specialist_id);
    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const inventory = await db.SpecialistInventory.findOne({
        where: { 
          inventory_id: item.inventory_id,
          specialist_id: specialist_id
        }
      });

      if (!inventory) {
        return res.status(404).json({ 
          error: `Inventory item ${item.inventory_id} not found for this specialist` 
        });
      }

      if (inventory.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for item ${item.inventory_id}`,
          available: inventory.stock_quantity
        });
      }

      const itemTotal = parseFloat(inventory.source_price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        unit_price: inventory.source_price,
        quality_rating: inventory.quality_rating
      });
    }

    // Create order
    const order = await db.SellerOrder.create({
      specialist_id,
      total_amount: totalAmount,
      status: 'Pending'
    });

    // Create order items
    for (const item of orderItems) {
      await db.SellerOrderItem.create({
        seller_order_id: order.seller_order_id,
        ...item
      });
    }

    const completeOrder = await db.SellerOrder.findByPk(order.seller_order_id, {
      include: [
        { model: db.Specialist },
        {
          model: db.SellerOrderItem,
          include: [{
            model: db.SpecialistInventory,
            include: [{ model: db.Scroll }]
          }]
        }
      ]
    });

    res.status(201).json({
      message: 'Order placed successfully. Waiting for specialist approval.',
      order: completeOrder
    });

  } catch (error) {
    console.error('Error creating seller order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

router.put('/:id/cancel', isAuthenticated, isSeller, async (req, res) => {
  try {
    const order = await db.SellerOrder.findByPk(req.params.id);

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

// Get orders for specialist
router.get('/specialist/my-orders', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const { status } = req.query;
    let whereClause = { specialist_id: specialist.specialist_id };
    
    if (status) {
      whereClause.status = status;
    }

    const orders = await db.SellerOrder.findAll({
      where: whereClause,
      include: [{
        model: db.SellerOrderItem,
        include: [{
          model: db.SpecialistInventory,
          include: [{ model: db.Scroll }]
        }]
      }],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching specialist orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

router.get('/specialist/my-orders/:id', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const order = await db.SellerOrder.findOne({
      where: { 
        seller_order_id: req.params.id,
        specialist_id: specialist.specialist_id
      },
      include: [{
        model: db.SellerOrderItem,
        include: [{
          model: db.SpecialistInventory,
          include: [{ model: db.Scroll }]
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

router.put('/specialist/my-orders/:id/approve', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const order = await db.SellerOrder.findOne({
      where: { 
        seller_order_id: req.params.id,
        specialist_id: specialist.specialist_id
      },
      include: [{
        model: db.SellerOrderItem,
        include: [{ model: db.SpecialistInventory }]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Can only approve pending orders' });
    }

    for (const item of order.SellerOrderItems) {
      if (item.SpecialistInventory.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          error: 'Insufficient stock to fulfill order',
          item: item.inventory_id
        });
      }
    }

    for (const item of order.SellerOrderItems) {
      item.SpecialistInventory.stock_quantity -= item.quantity;
      await item.SpecialistInventory.save();

      const scroll_id = item.SpecialistInventory.scroll_id;
      
      const [shopItem, created] = await db.ShopInventory.findOrCreate({
        where: { 
          scroll_id,
          specialist_id: specialist.specialist_id
        },
        defaults: {
          quantity: item.quantity,
          purchase_price: item.unit_price,
          selling_price: parseFloat(item.unit_price) * 1.5, // 50% markup default
          quality_rating: item.quality_rating
        }
      });

      if (!created) {
        shopItem.quantity += item.quantity;
        await shopItem.save();
      }
    }

    order.status = 'Approved';
    await order.save();

    res.json({
      message: 'Order approved. Stock has been transferred to shop inventory.',
      order
    });

  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({ error: 'Error approving order' });
  }
});

router.put('/specialist/my-orders/:id/decline', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const order = await db.SellerOrder.findOne({
      where: { 
        seller_order_id: req.params.id,
        specialist_id: specialist.specialist_id
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Can only decline pending orders' });
    }

    order.status = 'Declined';
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

module.exports = router;