const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', projectController.getAllProjects);
router.get('/assigned', protect, projectController.getAssignedProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id/progress', protect, projectController.updateProjectProgress);
router.get('/:id/qrcode/:clientId', protect, projectController.getClientQRCode);

module.exports = router;
