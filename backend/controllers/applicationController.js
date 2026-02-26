const Application = require('../models/Application');
const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId/apply
// @access  Private/JobSeeker
const applyForJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            res.status(400);
            throw new Error('You have already applied for this job');
        }

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        res.status(201).json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Get applied jobs for a user
// @route   GET /api/applications/me
// @access  Private/JobSeeker
const getAppliedJobs = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    select: 'name email company'
                }
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/JobSeeker
const withdrawApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        // Checking if it belongs to logged in user
        if (application.applicant.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to withdraw this application');
        }

        await application.deleteOne();
        res.json({ message: 'Application withdrawn successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/:jobId/applicants
// @access  Private/Recruiter
const getJobApplicants = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        if (
            job.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(401);
            throw new Error('Not authorized to view applicants for this job');
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email skills resume')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        if (
            application.job.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(401);
            throw new Error('Not authorized to update this application');
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Save a job
// @route   POST /api/applications/:jobId/save
// @access  Private/JobSeeker
const saveJob = async (req, res, next) => {
    try {
        const existingSavedJob = await SavedJob.findOne({
            job: req.params.jobId,
            user: req.user._id,
        });

        if (existingSavedJob) {
            res.status(400);
            throw new Error('Job is already saved');
        }

        const savedJob = await SavedJob.create({
            job: req.params.jobId,
            user: req.user._id,
        });

        res.status(201).json(savedJob);
    } catch (error) {
        next(error);
    }
};

// @desc    Get saved jobs
// @route   GET /api/applications/saved
// @access  Private/JobSeeker
const getSavedJobs = async (req, res, next) => {
    try {
        const savedJobs = await SavedJob.find({ user: req.user._id })
            .populate('job')
            .sort({ createdAt: -1 });

        res.json(savedJobs);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove saved job
// @route   DELETE /api/applications/saved/:id
// @access  Private/JobSeeker
const removeSavedJob = async (req, res, next) => {
    try {
        const savedJob = await SavedJob.findById(req.params.id);

        if (!savedJob) {
            res.status(404);
            throw new Error('Saved job not found');
        }

        if (savedJob.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to remove this saved job');
        }

        await savedJob.deleteOne();
        res.json({ message: 'Saved job removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyForJob,
    getAppliedJobs,
    withdrawApplication,
    getJobApplicants,
    updateApplicationStatus,
    saveJob,
    getSavedJobs,
    removeSavedJob,
};
