const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getAppliedJobs,
    withdrawApplication,
    getJobApplicants,
    updateApplicationStatus,
    saveJob,
    getSavedJobs,
    removeSavedJob,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/me').get(protect, authorize('jobseeker'), getAppliedJobs);
router.route('/saved').get(protect, authorize('jobseeker'), getSavedJobs);
router.route('/saved/:id').delete(protect, authorize('jobseeker'), removeSavedJob);

router
    .route('/:jobId/apply')
    .post(protect, authorize('jobseeker'), applyForJob);

router
    .route('/:jobId/applicants')
    .get(protect, authorize('recruiter', 'admin'), getJobApplicants);

router
    .route('/:jobId/save')
    .post(protect, authorize('jobseeker'), saveJob);

router
    .route('/:id/status')
    .put(protect, authorize('recruiter', 'admin'), updateApplicationStatus);

router
    .route('/:id')
    .delete(protect, authorize('jobseeker'), withdrawApplication);

module.exports = router;
