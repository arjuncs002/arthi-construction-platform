const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:projectId', protect, requestController.getRequests);
router.post('/:projectId', protect, requestController.createRequest);
router.patch('/:requestId', protect, requestController.updateRequestStatus);

module.exports = router;
