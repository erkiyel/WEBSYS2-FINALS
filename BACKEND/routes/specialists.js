const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { isSpecialist, isSeller } = require('../middleware/roles');

router.get('/', async (req, res) => {
  try {
    const specialists = await db.Specialist.findAll({
      include: [
        {
          model: db.User,
          attributes: ['username', 'email']
        },
        {
          model: db.Element,
          as: 'specialtyElement'
        }
      ]
    });

    res.json(specialists);
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({ error: 'Error fetching specialists' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const specialist = await db.Specialist.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          attributes: ['username', 'email']
        },
        {
          model: db.Element,
          as: 'specialtyElement'
        }
      ]
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist not found' });
    }

    res.json(specialist);
  } catch (error) {
    console.error('Error fetching specialist:', error);
    res.status(500).json({ error: 'Error fetching specialist' });
  }
});

router.get('/:id/inventory', async (req, res) => {
  try {
    const inventory = await db.SpecialistInventory.findAll({
      where: { 
        specialist_id: req.params.id,
        stock_quantity: { [db.sequelize.Sequelize.Op.gt]: 0 }
      },
      include: [{
        model: db.Scroll,
        include: [{
          model: db.Element,
          through: { attributes: [] }
        }]
      }]
    });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching specialist inventory:', error);
    res.status(500).json({ error: 'Error fetching inventory' });
  }
});

router.get('/me/profile', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id },
      include: [{
        model: db.Element,
        as: 'specialtyElement'
      }]
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    res.json(specialist);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

router.get('/me/inventory', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const inventory = await db.SpecialistInventory.findAll({
      where: { specialist_id: specialist.specialist_id },
      include: [{
        model: db.Scroll,
        include: [{
          model: db.Element,
          through: { attributes: [] }
        }]
      }]
    });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Error fetching inventory' });
  }
});

router.post('/me/inventory', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const { 
      scroll_id, 
      stock_quantity, 
      source_price, 
      quality_rating, 
      is_specialty 
    } = req.body;

    if (!scroll_id || !stock_quantity || !source_price || !quality_rating) {
      return res.status(400).json({ 
        error: 'scroll_id, stock_quantity, source_price, and quality_rating are required' 
      });
    }

    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const scroll = await db.Scroll.findByPk(scroll_id);
    if (!scroll) {
      return res.status(404).json({ error: 'Scroll not found' });
    }

    const existing = await db.SpecialistInventory.findOne({
      where: { 
        specialist_id: specialist.specialist_id,
        scroll_id
      }
    });

    if (existing) {
      return res.status(400).json({ 
        error: 'Scroll already in inventory. Use update endpoint to modify.' 
      });
    }

    const inventoryItem = await db.SpecialistInventory.create({
      specialist_id: specialist.specialist_id,
      scroll_id,
      stock_quantity,
      source_price,
      quality_rating,
      is_specialty: is_specialty || false
    });

    const completeItem = await db.SpecialistInventory.findByPk(inventoryItem.inventory_id, {
      include: [{
        model: db.Scroll,
        include: [{ model: db.Element, through: { attributes: [] } }]
      }]
    });

    res.status(201).json({
      message: 'Scroll added to inventory',
      item: completeItem
    });

  } catch (error) {
    console.error('Error adding to inventory:', error);
    res.status(500).json({ error: 'Error adding to inventory' });
  }
});

router.put('/me/inventory/:inventory_id', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const { stock_quantity, source_price, quality_rating, is_specialty } = req.body;

    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const item = await db.SpecialistInventory.findOne({
      where: {
        inventory_id: req.params.inventory_id,
        specialist_id: specialist.specialist_id
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    if (stock_quantity !== undefined) item.stock_quantity = stock_quantity;
    if (source_price !== undefined) item.source_price = source_price;
    if (quality_rating !== undefined) item.quality_rating = quality_rating;
    if (is_specialty !== undefined) item.is_specialty = is_specialty;
    item.last_updated = new Date();

    await item.save();

    const updatedItem = await db.SpecialistInventory.findByPk(item.inventory_id, {
      include: [{
        model: db.Scroll,
        include: [{ model: db.Element, through: { attributes: [] } }]
      }]
    });

    res.json({
      message: 'Inventory updated',
      item: updatedItem
    });

  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Error updating inventory' });
  }
});

router.put('/me/inventory/:inventory_id/add-stock', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const item = await db.SpecialistInventory.findOne({
      where: {
        inventory_id: req.params.inventory_id,
        specialist_id: specialist.specialist_id
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    item.stock_quantity += quantity;
    item.last_updated = new Date();
    await item.save();

    res.json({
      message: `Added ${quantity} to stock`,
      new_quantity: item.stock_quantity
    });

  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Error adding stock' });
  }
});

router.delete('/me/inventory/:inventory_id', isAuthenticated, isSpecialist, async (req, res) => {
  try {
    const specialist = await db.Specialist.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!specialist) {
      return res.status(404).json({ error: 'Specialist profile not found' });
    }

    const item = await db.SpecialistInventory.findOne({
      where: {
        inventory_id: req.params.inventory_id,
        specialist_id: specialist.specialist_id
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const pendingOrders = await db.SellerOrderItem.findAll({
      where: { inventory_id: item.inventory_id },
      include: [{
        model: db.SellerOrder,
        where: { status: 'Pending' }
      }]
    });

    if (pendingOrders.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot remove item with pending orders' 
      });
    }

    await item.destroy();

    res.json({ message: 'Inventory item removed' });

  } catch (error) {
    console.error('Error removing inventory:', error);
    res.status(500).json({ error: 'Error removing inventory' });
  }
});

module.exports = router;