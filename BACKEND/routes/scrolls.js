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
    const { rarity, element, search, minPrice, maxPrice } = req.query;

    let inventoryWhere = {
      quantity: { [Op.gt]: 0 }
    };

    if (minPrice) {
      inventoryWhere.selling_price = { 
        ...inventoryWhere.selling_price,
        [Op.gte]: parseFloat(minPrice) 
      };
    }
    if (maxPrice) {
      inventoryWhere.selling_price = { 
        ...inventoryWhere.selling_price,
        [Op.lte]: parseFloat(maxPrice) 
      };
    }

    const availableScrolls = await db.SpecialistInventory.findAll({
      where: inventoryWhere,
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
          attributes: ['shop_name', 'reputation_rating'],
          include: [{
            model: db.Element,
            as: 'specialtyElement',
            attributes: ['element_name']
          }]
        }
      ]
    });

    let result = availableScrolls;
    if (rarity) {
      result = availableScrolls.filter(item => item.Scroll.rarity === rarity);
    }

    const formattedResult = result.map(item => ({
      shop_inventory_id: item.shop_inventory_id,
      scroll: {
        scroll_id: item.Scroll.scroll_id,
        scroll_name: item.Scroll.scroll_name,
        description: item.Scroll.description,
        base_power: item.Scroll.base_power,
        rarity: item.Scroll.rarity,
        elements: item.Scroll.Elements.map(e => e.element_name)
      },
      quantity_available: item.quantity,
      price: item.selling_price,
      quality_rating: item.quality_rating,
      sourced_from: {
        shop_name: item.Specialist.shop_name,
        specialty: item.Specialist.specialtyElement?.element_name,
        reputation: item.Specialist.reputation_rating
      }
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error('Error fetching available scrolls:', error);
    res.status(500).json({ error: 'Error fetching available scrolls' });
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
            as: 'specialtyElement',
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
        specialty: item.Specialist.specialtyElement?.element_name,
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