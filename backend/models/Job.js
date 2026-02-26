const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a job title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [10000, 'Description cannot be more than 10000 characters'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        salary: {
            type: Number,
            required: [true, 'Please add an estimated salary'],
        },
        category: {
            type: String,
            default: 'Other',
        },
        skillsRequired: {
            type: [String],
            required: [true, 'Please add skills required'],
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
