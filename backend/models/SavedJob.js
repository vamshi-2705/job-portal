const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.ObjectId,
            ref: 'Job',
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SavedJob', savedJobSchema);
