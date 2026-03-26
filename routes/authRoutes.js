const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const SECRET = "mysecretkey";
// Signup
router.post("/signup", async (req, res) => {
    try {
        console.log("BODY:", req.body); // 🔥 DEBUG

        const {
            name,
            email,
            password,
            phone,
            github,
            linkedin,
            education,
            projects,
            experience
        } = req.body;

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).send("User already exists");
        }

        const user = new User({
            name,
            email,
            password,
            phone,
            github,
            linkedin,
            education,
            projects,
            experience
        });
        await user.save();

        res.json({ message: "Signup successful", user });
    } catch (err) {
        console.error(err); // 🔥 IMPORTANT
        res.status(500).send(err.message);
    }
});

// ✅ LOGIN (ADD THIS BELOW SIGNUP)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).send("User not found");
        if (user.password !== password)
            return res.status(400).send("Invalid password");

        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ✅ GET LOGGED IN USER
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE PROFILE
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

module.exports = router;