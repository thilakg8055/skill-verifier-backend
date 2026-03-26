const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

    phone: String,
    profilePic: String,

    github: String,
    linkedin: String,

    education: [
        {
            college: String,
            degree: String,
            education: [
                {
                    college: String,
                    degree: String,
                    year: String,
                },
            ],

            experience: [
                {
                    company: String,
                    role: String,
                    duration: String,
                },
            ],

            projects: [
                {
                    title: String,
                    description: String,
                    link: String,
                },
            ],
        }
    ],

    projects: [
        {
            title: String,
            description: String,
        }
    ],

    experience: [
        {
            company: String,
            role: String,
            duration: String,
        }
    ]
});

module.exports = mongoose.model("User", userSchema);