const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
const { protect } = require('../middleware/authMiddleware');

const { parser } = require('../config/cloudinary');

router.get('/:projectId', updateController.getUpdatesByProject);
router.post('/:projectId', protect, updateController.createUpdate);
router.delete('/:updateId', protect, updateController.deleteUpdate);

// Gallery endpoints
router.get('/gallery/:projectId', updateController.getGallery);
router.post('/gallery/:projectId', protect, parser.single('file'), updateController.uploadGalleryItem);
router.post('/gallery/url/:projectId', protect, updateController.uploadGalleryByUrl);
router.delete('/gallery/item/:itemId', protect, updateController.deleteGalleryItem);

module.exports = router;
