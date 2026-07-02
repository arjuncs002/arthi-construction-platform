const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/messages/:projectId', protect, chatController.getChatMessages);
router.post('/messages/:projectId', protect, chatController.sendMessage);

module.exports = router;
