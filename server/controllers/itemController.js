// controllers/itemController.js
const Item = require('../models/Item'); // assume you have a Mongoose model

const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    const item = await Item.create({ title, description, imageUrl });
    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error); // ← log it
    res.status(500).json({ message: 'Server error', error });
  }
};


const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createItem, getItems };
