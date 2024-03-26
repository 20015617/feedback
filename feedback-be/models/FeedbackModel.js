const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const feedbackSchema = new schema({
    feedback: { 
        type: String
    },
    userId: {
        type: ObjectId,
        ref: "users"
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("feedbacks", feedbackSchema);