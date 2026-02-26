const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    deleteUser,
    getAdminStats,
    getRecruiterStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/admin/stats').get(protect, authorize('admin'), getAdminStats);
router.route('/recruiter/stats').get(protect, authorize('recruiter'), getRecruiterStats);

router.route('/').get(protect, authorize('admin'), getUsers);
router
    .route('/:id')
    .get(protect, authorize('admin'), getUserById)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
