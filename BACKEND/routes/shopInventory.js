// Seller's shop inventory management
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { isAuthenticated } = require('../middleware/auth');
const { isSeller } = require('../middleware/roles');

// Get all shop inventory
router.get('/', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { rarity, element, search } = req.query;

    const inventory = await db.ShopInventory.findAll({
      include: [
        {
          model: db.Scroll,
          where: search ? { scroll_name: { [Op.like]: `%${search}%` } } : undefined,
          include: [{
            model: db.Element,
            through: { attributes: [] },
            where: element ? { element_name: element } : undefined
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

    // Filter
    let result = inventory;
    if (rarity) {
      result = inventory.filter(item => item.Scroll.rarity === rarity);
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching shop inventory:', error);
    res.status(500).json({ error: 'Error fetching shop inventory' });
  }
});

router.get('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const item = await db.ShopInventory.findByPk(req.params.id, {
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
          include: [
            { model: db.User, attributes: ['username', 'email'] },
            { model: db.Element, as: 'specialtyElement' }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Error fetching item' });
  }
});

router.put('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const { selling_price } = req.body;
    
    const item = await db.ShopInventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (selling_price !== undefined) {
      if (selling_price <= 0) {
        return res.status(400).json({ error: 'Selling price must be positive' });
      }
      item.selling_price = selling_price;
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

router.delete('/:id', isAuthenticated, isSeller, async (req, res) => {
  try {
    const item = await db.ShopInventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const pendingOrders = await db.OrderItem.findAll({
      where: { shop_inventory_id: item.shop_inventory_id },
      include: [{
        model: db.Order,
        where: { status: 'Pending' }
      }]
    });

    if (pendingOrders.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot remove item with pending customer orders' 
      });
    }

    await item.destroy();

    res.json({ message: 'Item removed from shop listing' });

  } catch (error) {
    console.error('Error deleting shop inventory item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Get shop statistics (Seller dashboard)
router.get('/stats/overview', isAuthenticated, isSeller, async (req, res) => {
  try {
    const totalItems = await db.ShopInventory.count();
    
    const stockSum = await db.ShopInventory.sum('quantity');
    
    const inventory = await db.ShopInventory.findAll();
    const totalValue = inventory.reduce((sum, item) => {
      return sum + (parseFloat(item.selling_price) * item.quantity);
    }, 0);

    const lowStock = await db.ShopInventory.findAll({
      where: { quantity: { [Op.lt]: 5, [Op.gt]: 0 } },
      include: [{ model: db.Scroll }]
    });

    const outOfStock = await db.ShopInventory.findAll({
      where: { quantity: 0 },
      include: [{ model: db.Scroll }]
    });

    res.json({
      totalItems,
      totalStock: stockSum || 0,
      totalValue: totalValue.toFixed(2),
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

module.exports = router;