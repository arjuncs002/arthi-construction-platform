const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { parser } = require('../config/cloudinary');

router.get('/:projectId', protect, documentController.getDocuments);
router.post('/:projectId', protect, parser.single('file'), documentController.uploadDocument);
router.delete('/:documentId', protect, documentController.deleteDocument);

module.exports = router;
