// elo_backend/routes/championRoutes.js
const express = require('express');
const router = express.Router();
const Champion = require('../models/Champion'); // Đảm bảo đường dẫn đúng

// @route   GET /api/champions
// @desc    Get all champions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const champions = await Champion.find().sort({ name: 1 }); // Sắp xếp theo tên
    res.json(champions);
  } catch (err) {
    console.error('Error fetching champions:', err.message);
    res.status(500).send('Server Error when fetching champions');
  }
});

// @route   GET /api/champions/:id
// @desc    Get a single champion by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);

    if (!champion) {
      return res.status(404).json({ msg: 'Champion not found' });
    }
    res.json(champion);
  } catch (err) {
    console.error('Error fetching champion by ID:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Champion not found (invalid ID format)' });
    }
    res.status(500).send('Server Error when fetching champion by ID');
  }
});

// @route   POST /api/champions
// @desc    Create a new champion
// @access  Public (Nên là Private/Admin trong thực tế)
router.post('/', async (req, res) => {
  const {
    name,
    title,
    description,
    imageUrl,
    championClass, // Đổi từ tags/partype/image trong ví dụ trước
    abilities,     // Mảng các abilities
    baseStats      // Object chứa các base stats
  } = req.body;

  try {
    let champion = await Champion.findOne({ name });
    if (champion) {
      return res.status(400).json({ msg: 'Champion with this name already exists' });
    }

    // Validate required fields (Mongoose cũng sẽ validate, nhưng kiểm tra sớm hơn cũng tốt)
    if (!name || !title || !championClass) {
        return res.status(400).json({ msg: 'Please include name, title, and championClass' });
    }

    champion = new Champion({
      name,
      title,
      description,
      imageUrl,
      championClass,
      abilities,
      baseStats
    });

    await champion.save();
    res.status(201).json(champion);
  } catch (err) {
    console.error('Error creating champion:', err.message);
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server Error when creating champion');
  }
});

// @route   PUT /api/champions/:id
// @desc    Update an existing champion
// @access  Public (Nên là Private/Admin)
router.put('/:id', async (req, res) => {
  const {
    name,
    title,
    description,
    imageUrl,
    championClass,
    abilities,
    baseStats
  } = req.body;

  // Build champion object
  const championFields = {};
  if (name !== undefined) championFields.name = name; // Kiểm tra undefined để cho phép gửi chuỗi rỗng nếu muốn
  if (title !== undefined) championFields.title = title;
  if (description !== undefined) championFields.description = description;
  if (imageUrl !== undefined) championFields.imageUrl = imageUrl;
  if (championClass !== undefined) championFields.championClass = championClass;
  if (abilities !== undefined) championFields.abilities = abilities;
  if (baseStats !== undefined) championFields.baseStats = baseStats;

  try {
    let champion = await Champion.findById(req.params.id);
    if (!champion) {
      return res.status(404).json({ msg: 'Champion not found' });
    }

    // Nếu cập nhật tên, kiểm tra xem tên mới có bị trùng không (trừ chính champion đang sửa)
    if (name && name !== champion.name) {
        const existingChampion = await Champion.findOne({ name });
        if (existingChampion) {
            return res.status(400).json({ msg: 'Champion name already exists' });
        }
    }

    champion = await Champion.findByIdAndUpdate(
      req.params.id,
      { $set: championFields },
      { new: true, runValidators: true } // runValidators: true để Mongoose chạy lại validation khi update
    );
    res.json(champion);
  } catch (err) {
    console.error('Error updating champion:', err.message);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Champion not found (invalid ID format)' });
    }
    res.status(500).send('Server Error when updating champion');
  }
});

// @route   DELETE /api/champions/:id
// @desc    Delete a champion
// @access  Public (Nên là Private/Admin)
router.delete('/:id', async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) {
      return res.status(404).json({ msg: 'Champion not found' });
    }

    await Champion.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Champion removed' });
  } catch (err) {
    console.error('Error deleting champion:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Champion not found (invalid ID format)' });
    }
    res.status(500).send('Server Error when deleting champion');
  }
});

module.exports = router;