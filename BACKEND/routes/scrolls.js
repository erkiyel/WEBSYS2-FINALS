// Browse scrolls and shop listings
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { rarity, element, search } = req.query;
    
    let whereClause = {};
    let include = [{
      model: db.Element,
      through: { attributes: [] }
    }];

    if (rarity) {
      whereClause.rarity = rarity;
    }

    if (search) {
      whereClause.scroll_name = {
        [Op.like]: `%${search}%`
      };
    }

    if (element) {
      include[0].where = { element_name: element };
    }

    const scrolls = await db.Scroll.findAll({
      where: whereClause,
      include
    });

    res.json(scrolls);
  } catch (error) {
    console.error('Error fetching scrolls:', error);
    res.status(500).json({ error: 'Error fetching scrolls' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scroll = await db.Scroll.findByPk(req.params.id, {
      include: [{
        model: db.Element,
        through: { attributes: [] }
      }]
    });

    if (!scroll) {
      return res.status(404).json({ error: 'Scroll not found' });
    }

    res.json(scroll);
  } catch (error) {
    console.error('Error fetching scroll:', error);
    res.status(500).json({ error: 'Error fetching scroll' });
  }
});


router.get('/shop/available', async (req, res) => {
  try {
    console.log('Getting available scrolls...');
    
    // Simple query without filters first
    const availableScrolls = await db.ShopInventory.findAll({
      where: { quantity: { [Op.gt]: 0 } },
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
          attributes: ['shop_name']
        }
      ],
      limit: 20
    });
    
    console.log(`Found ${availableScrolls.length} items`);
    
    const formattedResult = availableScrolls.map(item => ({
      shop_inventory_id: item.shop_inventory_id,
      scroll: {
        scroll_name: item.Scroll?.scroll_name,
        description: item.Scroll?.description,
        rarity: item.Scroll?.rarity,
        base_power: item.Scroll?.base_power,
        elements: item.Scroll?.Elements?.map(e => e.element_name) || []
      },
      quantity_available: item.quantity,
      price: item.selling_price,
      sourced_from: {
        shop_name: item.Specialist?.shop_name || 'Unknown Shop'
      }
    }));
    
    res.json(formattedResult);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching scrolls' });
  }
});

router.get('/shop/available/:shop_inventory_id', async (req, res) => {
  try {
    const item = await db.ShopInventory.findOne({
      where: { 
        shop_inventory_id: req.params.shop_inventory_id,
        quantity: { [Op.gt]: 0 }
      },
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
          attributes: ['shop_name', 'reputation_rating'],
          include: [{
            model: db.Element,
            attributes: ['element_name']
          }]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or out of stock' });
    }

    res.json({
      shop_inventory_id: item.shop_inventory_id,
      scroll: {
        scroll_id: item.Scroll.scroll_id,
        scroll_name: item.Scroll.scroll_name,
        description: item.Scroll.description,
        base_power: item.Scroll.base_power,
        rarity: item.Scroll.rarity,
        elements: item.Scroll.Elements.map(e => ({
          element_id: e.element_id,
          element_name: e.element_name,
          description: e.description
        }))
      },
      quantity_available: item.quantity,
      price: item.selling_price,
      quality_rating: item.quality_rating,
      sourced_from: {
        shop_name: item.Specialist.shop_name,
        specialty: item.Specialist?.Element?.element_name,
        reputation: item.Specialist.reputation_rating
      }
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Error fetching item' });
  }
});

router.get('/filters/elements', async (req, res) => {
  try {
    const elements = await db.Element.findAll({
      attributes: ['element_id', 'element_name']
    });
    res.json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    res.status(500).json({ error: 'Error fetching elements' });
  }
});

router.get('/filters/rarities', async (req, res) => {
  res.json(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);
});

module.exports = router;