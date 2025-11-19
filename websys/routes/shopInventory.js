const express = require('express');
const router = express.Router();
const db = require('../models');
const { isAuthenticated } = require('../middleware/auth');
const { isSeller } = require('../middleware/roles');

// Get all shop inventory for Seller
router.get('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const inventory = await db.ShopInventory.findAll({
      include: [
        {
          model: db.Scroll,
          include: [{
            model: db.Element,
            through: { attributes: [] }
          }]
        },
        {
          model: db.Specialist,
          include: [{
            model: db.Element,
            as: 'specialtyElement'
          }]
        }
      ]
    });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching shop inventory:', error);
    res.status(500).json({ error: 'Error fetching shop inventory' });
  }
});

// Add item to shop inventory purchase from specialist
router.post('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { 
      scroll_id, 
      specialist_id, 
      quantity, 
      purchase_price, 
      selling_price, 
      quality_rating 
    } = req.body;

    // Validate required fields
    if (!scroll_id || !specialist_id || !quantity || !purchase_price || !selling_price || !quality_rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if specialist has enough stock
    const specialistInventory = await db.SpecialistInventory.findOne({
      where: { 
        specialist_id, 
        scroll_id 
      }
    });

    if (!specialistInventory) {
      return res.status(404).json({ error: 'Scroll not found in specialist inventory' });
    }

    if (specialistInventory.stock_quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        available: specialistInventory.stock_quantity 
      });
    }

    // Create or update shop inventory
    const [shopItem, created] = await db.ShopInventory.findOrCreate({
      where: { 
        scroll_id, 
        specialist_id 
      },
      defaults: {
        quantity,
        purchase_price,
        selling_price,
        quality_rating
      }
    });

    if (!created) {
      // Update existing item
      shopItem.quantity += quantity;
      shopItem.purchase_price = purchase_price;
      shopItem.selling_price = selling_price;
      shopItem.quality_rating = quality_rating;
      await shopItem.save();
    }

    // Update specialist inventory
    specialistInventory.stock_quantity -= quantity;
    await specialistInventory.save();

    // Fetch complete data
    const updatedItem = await db.ShopInventory.findByPk(shopItem.shop_inventory_id, {
      include: [
        { model: db.Scroll },
        { model: db.Specialist }
      ]
    });

    res.status(201).json({
      message: created ? 'Item added to shop inventory' : 'Shop inventory updated',
      item: updatedItem
    });

  } catch (error) {
    console.error('Error adding to shop inventory:', error);
    res.status(500).json({ error: 'Error adding to shop inventory' });
  }
});

// Update item
router.put('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { selling_price, quantity } = req.body;
    
    const item = await db.ShopInventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (selling_price !== undefined) {
      item.selling_price = selling_price;
    }
    
    if (quantity !== undefined) {
      item.quantity = quantity;
    }

    await item.save();

    const updatedItem = await db.ShopInventory.findByPk(item.shop_inventory_id, {
      include: [
        { model: db.Scroll },
        { model: db.Specialist }
      ]
    });

    res.json({
      message: 'Shop inventory updated',
      item: updatedItem
    });

  } catch (error) {
    console.error('Error updating shop inventory:', error);
    res.status(500).json({ error: 'Error updating shop inventory' });
  }
});

// Delete item
router.delete('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const item = await db.ShopInventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();

    res.json({ message: 'Item removed from shop inventory' });

  } catch (error) {
    console.error('Error deleting shop inventory item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;