const express = require('express');
const router = express.Router();
const { syncExternalJobs } = require('../controllers/jobController');

router.get('/sync', async (req, res) => {
    await syncExternalJobs();
    res.json({ message: 'Manual sync complete' });
});
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, authorize('recruiter', 'admin'), createJob);
router
    .route('/:id')
    .get(getJobById)
    .put(protect, authorize('recruiter', 'admin'), updateJob)
    .delete(protect, authorize('admin', 'recruiter'), deleteJob);

module.exports = router;
