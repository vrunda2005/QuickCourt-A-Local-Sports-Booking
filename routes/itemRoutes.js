const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { requireAuth } = require('../utils/clerk');
const { createItem, getItems } = require('../controllers/itemController');

const router = express.Router();
const upload = multer({ storage });

const handleGetItems = (req, res, next) => getItems(req, res, next);
const handleCreateItem = (req, res, next) => createItem(req, res, next);

router.get('/', requireAuth, handleGetItems);
router.post('/', requireAuth, upload.single('image'), handleCreateItem);

const itemRoutes = router;
module.exports = itemRoutes;
