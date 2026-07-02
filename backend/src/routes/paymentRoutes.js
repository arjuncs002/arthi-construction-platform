const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:projectId', protect, paymentController.getPayments);
router.post('/:projectId', protect, paymentController.createPayment);
router.patch('/:paymentId', protect, paymentController.updatePaymentStatus);

module.exports = router;
