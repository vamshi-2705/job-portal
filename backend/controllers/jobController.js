const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const axios = require('axios');

/* ================================
   🔄 AUTO SYNC EXTERNAL JOBS
================================ */

const syncExternalJobs = async () => {
    try {
        console.log('🔄 Syncing external jobs...');

        const response = await axios.get(
            'https://remotive.com/api/remote-jobs'
        );

        const jobs = response.data.jobs;

        for (let job of jobs) {
            // Avoid duplicates
            const exists = await Job.findOne({
                title: job.title,
                company: job.company_name,
            });

            if (!exists) {
                await Job.create({
                    title: job.title,
                    description: job.description
                        ? job.description.replace(/<[^>]*>/g, '').substring(0, 1000)
                        : 'No description provided',
                    company: job.company_name,
                    location: job.candidate_required_location || 'Remote',
                    salary: job.salary
                        ? parseInt(job.salary.replace(/\D/g, '')) || 0
                        : 0,
                    category: job.category || 'General',
                    skillsRequired: [],
                    // No postedBy because external jobs
                });
            }
        }

        console.log('✅ External jobs synced successfully');
    } catch (error) {
        console.error('❌ External sync failed:', error.message);
    }
};

/* ================================
   GET ALL JOBS
================================ */

const getJobs = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const query = {};

        if (req.query.keyword) {
            query.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { company: { $regex: req.query.keyword, $options: 'i' } },
            ];
        }

        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.minSalary) {
            query.salary = { $gte: Number(req.query.minSalary) };
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        const count = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate('postedBy', 'name email company')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            jobs,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    } catch (error) {
        next(error);
    }
};

/* ================================
   GET JOB BY ID
================================ */

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            'postedBy',
            'name email'
        );

        if (job) {
            res.json(job);
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

/* ================================
   CREATE JOB
================================ */

const createJob = async (req, res, next) => {
    try {
        const {
            title,
            description,
            company,
            location,
            salary,
            category,
            skillsRequired,
        } = req.body;

        const job = new Job({
            title,
            description,
            company,
            location,
            salary,
            category,
            skillsRequired,
            postedBy: req.user._id,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        next(error);
    }
};

/* ================================
   UPDATE JOB
================================ */

const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            if (
                job.postedBy &&
                job.postedBy.toString() !== req.user._id.toString() &&
                req.user.role !== 'admin'
            ) {
                res.status(403);
                throw new Error('Not authorized to update this job');
            }

            job.title = req.body.title || job.title;
            job.description = req.body.description || job.description;
            job.company = req.body.company || job.company;
            job.location = req.body.location || job.location;
            job.salary = req.body.salary || job.salary;
            job.category = req.body.category || job.category;
            job.skillsRequired =
                req.body.skillsRequired || job.skillsRequired;

            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

/* ================================
   DELETE JOB
================================ */

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            if (
                job.postedBy &&
                job.postedBy.toString() !== req.user._id.toString() &&
                req.user.role !== 'admin'
            ) {
                res.status(403);
                throw new Error('Not authorized to delete this job');
            }

            await job.deleteOne();
            await Application.deleteMany({ job: job._id });
            await SavedJob.deleteMany({ job: job._id });

            res.json({ message: 'Job removed' });
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    syncExternalJobs, // 👈 important
};