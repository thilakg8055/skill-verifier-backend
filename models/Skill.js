const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
    name: String,
    verifierEmail: String,
    status: {
        type: String,
        default: "Applied",
        userId: String,   // 🔥 IMPORTANT
        company: String,
        description: String
    },

    // ✅ ADD THIS
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Skill", SkillSchema);