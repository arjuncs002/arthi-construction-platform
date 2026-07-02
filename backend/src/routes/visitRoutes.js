const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:projectId', protect, visitController.getVisits);
router.post('/:projectId', protect, visitController.createVisit);
router.patch('/:visitId', protect, visitController.updateVisitStatus);

module.exports = router;
