const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot delete admin user');
            }

            await User.deleteOne({ _id: user._id });
            // Clean up user's jobs and applications could be added here
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin statistics
// @route   GET /api/users/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalJobs = await Job.countDocuments({});
        const totalApplications = await Application.countDocuments({});

        res.json({
            totalUsers,
            totalJobs,
            totalApplications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recruiter dashboard stats
// @route   GET /api/users/recruiter/stats
// @access  Private/Recruiter
const getRecruiterStats = async (req, res, next) => {
    try {
        const postedJobsCount = await Job.countDocuments({ postedBy: req.user._id });

        // Get all jobs posted by this recruiter
        const recruiterJobs = await Job.find({ postedBy: req.user._id }).select('_id');
        const jobIds = recruiterJobs.map(job => job._id);

        // Get all applications for those jobs
        const applicationsCount = await Application.countDocuments({ job: { $in: jobIds } });

        res.json({
            postedJobsCount,
            applicationsCount
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
    getAdminStats,
    getRecruiterStats
};
