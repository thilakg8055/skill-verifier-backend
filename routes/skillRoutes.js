// const express = require("express");
// const router = express.Router();
// const Skill = require("../models/Skill");
// const nodemailer = require("nodemailer");
// const authMiddleware = require("../middleware/authMiddleware");

// const { addSkillToBlockchain, getSkillsFromBlockchain } = require("../blockchain");
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });
// // ➕ Add Skill
// router.post("/add", authMiddleware, async (req, res) => {
//     try {

//         const newSkill = new Skill({
//             name: req.body.name,
//             verifierEmail: req.body.verifierEmail,
//             status: "Applied",
//             user: req.user.id,
//         });

//         const saved = await newSkill.save();

//         // EMAIL SETUP
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         // verification links
//         // const acceptLink = `http://192.168.0.105:3000/verify/${saved._id}/accept`;
//         // const rejectLink = `http://192.168.0.105:3000/verify/${saved._id}/reject`;
//         const acceptLink = `https://skill-verifier-frontend-2uqm.vercel.app/verify/${saved._id}/accept`;
//         const rejectLink = `https://skill-verifier-frontend-2uqm.vercel.app/verify/${saved._id}/reject`;

//         // send mail
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: saved.verifierEmail,
//             subject: "Skill Verification Request",
//             html: `
//         <h3>Please verify this skill:</h3>
//         <p><b>${saved.name}</b></p>

//         <a href="${acceptLink}" style="color:green;">Accept</a>
//         <br/><br/>
//         <a href="${rejectLink}" style="color:red;">Reject</a>
//       `,
//         });

//         res.json(saved);
//     } catch (err) {
//         console.error("🔥 EMAIL ERROR:", err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // 📥 Get all skills
// // router.get("/verify/:id/:action", async (req, res) => {
// //     try {
// //         const status =
// //             req.params.action === "accept" ? "Accepted" : "Rejected";

// //         await Skill.findByIdAndUpdate(req.params.id, { status });

// //         res.send(`Skill ${status}`);
// //     } catch (err) {
// //         res.status(500).send(err);
// //     }
// // });
// // ✅ GET ALL SKILLS FROM DATABASE
// router.get("/", authMiddleware, async (req, res) => {
//     try {
//         const skills = await Skill.find({ user: req.user.id });
//         res.json(skills);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // ✅ Get all skills
// router.get("/verify/:id/:action", async (req, res) => {
//     try {
//         const status =
//             req.params.action === "accept" ? "Accepted" : "Rejected";

//         const skill = await Skill.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );

//         // 🔥 BLOCKCHAIN INTEGRATION
//         if (status === "Accepted") {
//             await addSkillToBlockchain(skill.name, skill.verifierEmail);
//         }

//         res.send(`Skill ${status}`);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // 🔄 Update status
// // UPDATE STATUS
// router.put("/:id", async (req, res) => {
//     try {
//         const updated = await Skill.findByIdAndUpdate(
//             req.params.id,
//             { status: req.body.status },
//             { new: true }
//         );

//         res.json(updated);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });





// // GET blockchain skills
// router.get("/blockchain", async (req, res) => {
//     try {
//         const skills = await getSkillsFromBlockchain();

//         // 🔥 Convert raw array → clean JSON
//         const formatted = skills.map(s => ({
//             name: s[0],
//             user: s[1],
//             verified: s[2]
//         }));

//         res.json(formatted);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// router.post("/resend/:id", async (req, res) => {
//     try {
//         const skill = await Skill.findById(req.params.id);

//         if (!skill) return res.status(404).send("Skill not found");

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const acceptLink = `http://192.168.0.105:3000/verify/${skill._id}/accept`;
//         const rejectLink = `http://192.168.0.105:3000/verify/${skill._id}/reject`;

//         // await transporter.sendMail({
//         //     from: process.env.EMAIL_USER,
//         //     to: skill.verifierEmail,
//         //     subject: "Skill Verification Reminder",
//         //     html: `
//         //         <h3>Please verify this skill:</h3>
//         //         <p><b>${skill.name}</b></p>

//         //         <a href="${acceptLink}" style="color:green;">Accept</a>
//         //         <br/><br/>
//         //         <a href="${rejectLink}" style="color:red;">Reject</a>
//         //     `,
//         // });
//         try {
//             await transporter.sendMail({
//                 from: process.env.EMAIL_USER,
//                 to: saved.verifierEmail,
//                 subject: "Skill Verification Request",
//                 html: `
//       <h3>Please verify this skill:</h3>
//       <p><b>${saved.name}</b></p>

//       <a href="${acceptLink}" style="color:green;">Accept</a>
//       <br/><br/>
//       <a href="${rejectLink}" style="color:red;">Reject</a>
//     `,
//             });
//         } catch (emailErr) {
//             console.log("❌ Email failed:", emailErr.message);
//         }
//         res.send("Email resent");
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
// // ✅ PUBLIC RESUME API
// router.get("/user/:id", async (req, res) => {
//     try {
//         const skills = await Skill.find({
//             user: req.params.id,
//             status: "Accepted", // only verified
//         });

//         res.json(skills);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// // router.get("/user/:id", async (req, res) => {
// //     try {
// //         const skills = await Skill.find({
// //             userId: req.params.id,
// //             status: "verified"
// //         });

// //         res.json(skills);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });


// module.exports = router;






// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");

// const Skill = require("../models/Skill");
// const authMiddleware = require("../middleware/authMiddleware");
// const { addSkillToBlockchain, getSkillsFromBlockchain } = require("../blockchain");

// // ─── Nodemailer (single shared instance) ─────────────────────────────────────

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const BASE_URL = "https://skill-verifier-frontend-2uqm.vercel.app";

// const sendVerificationEmail = async (skill) => {
//     try {
//         const acceptLink = `${BASE_URL}/verify/${skill._id}/accept`;
//         const rejectLink = `${BASE_URL}/verify/${skill._id}/reject`;

//         await transporter.sendMail({
//             // from: process.env.EMAIL_USER,
//             from: `"SkillVerify" <${process.env.EMAIL_USER}>`,
//             to: skill.verifierEmail,
//             subject: "Skill Verification Request",
//             html: `
//             <h3>Please verify this skill:</h3>
//             <p><b>${skill.name}</b></p>
//             <a href="${acceptLink}" style="color:green;">✅ Accept</a>
//             <br/><br/>
//             <a href="${rejectLink}" style="color:red;">❌ Reject</a>
//         `,

//         });
//         console.log("✅ Email sent:", info.response);
//     }
//     catch (err) {
//         console.log("❌ Email failed:", err.message);
//     }
// };


// // ─── Routes ──────────────────────────────────────────────────────────────────

// // POST /skills/add — Add a new skill and email the verifier
// router.post("/add", authMiddleware, async (req, res) => {
//     try {
//         const newSkill = new Skill({
//             name: req.body.name,
//             verifierEmail: req.body.verifierEmail,
//             status: "Applied",
//             user: req.user.id,
//         });

//         const saved = await newSkill.save();

//         await sendVerificationEmail(saved);

//         res.json(saved);
//     } catch (err) {
//         console.error("❌ Add skill error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // GET /skills — Get all skills for the logged-in user
// router.get("/", authMiddleware, async (req, res) => {
//     try {
//         const skills = await Skill.find({ user: req.user.id });
//         res.json(skills);
//     } catch (err) {
//         console.error("❌ Fetch skills error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // GET /skills/verify/:id/:action — Verifier clicks Accept or Reject from email
// router.get("/verify/:id/:action", async (req, res) => {
//     try {
//         const status = req.params.action === "accept" ? "Accepted" : "Rejected";

//         const skill = await Skill.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );

//         if (!skill) return res.status(404).send("Skill not found.");

//         if (status === "Accepted") {
//             await addSkillToBlockchain(skill.name, skill.verifierEmail);
//         }

//         res.send(`Skill <b>${skill.name}</b> has been <b>${status}</b>.`);
//     } catch (err) {
//         console.error("❌ Verify skill error:", err.message);
//         res.status(500).send("Something went wrong.");
//     }
// });

// // PUT /skills/:id — Manually update skill status
// router.put("/:id", async (req, res) => {
//     try {
//         const updated = await Skill.findByIdAndUpdate(
//             req.params.id,
//             { status: req.body.status },
//             { new: true }
//         );

//         if (!updated) return res.status(404).json({ error: "Skill not found." });

//         res.json(updated);
//     } catch (err) {
//         console.error("❌ Update skill error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // POST /skills/resend/:id — Resend verification email
// router.post("/resend/:id", async (req, res) => {
//     try {
//         const skill = await Skill.findById(req.params.id);

//         if (!skill) return res.status(404).json({ error: "Skill not found." });

//         await sendVerificationEmail(skill);

//         res.json({ message: "Verification email resent successfully." });
//     } catch (err) {
//         console.error("❌ Resend email error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // GET /skills/blockchain — Fetch all skills stored on the blockchain
// router.get("/blockchain", async (req, res) => {
//     try {
//         const raw = await getSkillsFromBlockchain();

//         const skills = raw.map((s) => ({
//             name: s[0],
//             user: s[1],
//             verified: s[2],
//         }));

//         res.json(skills);
//     } catch (err) {
//         console.error("❌ Blockchain fetch error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // GET /skills/user/:id — Public resume API (only accepted skills)
// router.get("/user/:id", async (req, res) => {
//     try {
//         const skills = await Skill.find({
//             user: req.params.id,
//             status: "Accepted",
//         });

//         res.json(skills);
//     } catch (err) {
//         console.error("❌ Public resume fetch error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");
const { addSkillToBlockchain, getSkillsFromBlockchain } = require("../blockchain");

// ─── Nodemailer (single shared instance) ─────────────────────────────────────

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendVerificationEmail = async (skill) => {
    // const acceptLink = `${BASE_URL}/verify/${skill._id}/accept`;
    // const rejectLink = `${BASE_URL}/verify/${skill._id}/reject`;
    const acceptLink = `https://skill-verifier-backend.onrender.com/api/skills/verify/${skill._id}/accept`;
    const rejectLink = `https://skill-verifier-backend.onrender.com/api/skills/verify/${skill._id}/reject`;

    await apiInstance.sendTransacEmail({
        sender: { email: "tilakraj898989@gmail.com", name: "SkillVerify" },
        to: [{ email: skill.verifierEmail }],
        subject: "Skill Verification Request",
        htmlContent: `
            <h3>Please verify this skill:</h3>
            <p><b>${skill.name}</b></p>
            <a href="${acceptLink}">Accept</a><br/>
            <a href="${rejectLink}">Reject</a>
        `
    });
};

const BASE_URL = "https://skill-verifier-frontend-2uqm.vercel.app";

// const sendVerificationEmail = async (skill) => {
//     const acceptLink = `${BASE_URL}/verify/${skill._id}/accept`;
//     const rejectLink = `${BASE_URL}/verify/${skill._id}/reject`;

//     // ✅ Capture the return value — previous version used info.response without assigning it
//     const info = await transporter.sendMail({
//         from: `"SkillVerify" <${process.env.EMAIL_USER}>`,
//         to: skill.verifierEmail,
//         subject: "Skill Verification Request",
//         html: `
//             <div style="font-family: sans-serif; padding: 20px;">
//                 <h3>You have a new skill verification request</h3>
//                 <p>Skill: <b>${skill.name}</b></p>
//                 <a href="${acceptLink}" style="
//                     display:inline-block; padding:10px 20px;
//                     background:green; color:white; text-decoration:none;
//                     border-radius:5px; margin-right:10px;">
//                     ✅ Accept
//                 </a>
//                 <a href="${rejectLink}" style="
//                     display:inline-block; padding:10px 20px;
//                     background:red; color:white; text-decoration:none;
//                     border-radius:5px;">
//                     ❌ Reject
//                 </a>
//             </div>
//         `,
//     });

//     console.log("✅ Email sent:", info.response);
// };

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /skills/add — Add a new skill and email the verifier
// router.post("/add", authMiddleware, async (req, res) => {
//     try {
//         const newSkill = new Skill({
//             name: req.body.name,
//             verifierEmail: req.body.verifierEmail,
//             status: "Applied",
//             user: req.user.id,
//         });

//         const saved = await newSkill.save();

//         await sendVerificationEmail(saved);

//         res.json(saved);
//     } catch (err) {
//         console.error("❌ Add skill error:", err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

router.post("/add", authMiddleware, async (req, res) => {
    try {
        const newSkill = new Skill({
            name: req.body.name,
            verifierEmail: req.body.verifierEmail,
            status: "Applied",
            user: req.user.id,
        });

        const saved = await newSkill.save();

        // ✅ Email is attempted separately — a failure here won't return a 500
        try {
            await sendVerificationEmail(saved);
        } catch (emailErr) {
            // Skill is already saved — just log the email error, don't crash the request
            console.error("❌ Email failed (skill was saved):", emailErr.message);
        }

        res.json(saved);
    } catch (err) {
        console.error("❌ Add skill error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /skills — Get all skills for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id });
        res.json(skills);
    } catch (err) {
        console.error("❌ Fetch skills error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /skills/verify/:id/:action — Verifier clicks Accept or Reject from email
router.get("/verify/:id/:action", async (req, res) => {
    try {
        const status = req.params.action === "accept" ? "Accepted" : "Rejected";

        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!skill) return res.status(404).send("Skill not found.");

        if (status === "Accepted") {
            await addSkillToBlockchain(skill.name, skill.verifierEmail);
        }

        res.send(`Skill <b>${skill.name}</b> has been <b>${status}</b>.`);
    } catch (err) {
        console.error("❌ Verify skill error:", err.message);
        res.status(500).send("Something went wrong.");
    }
});

// PUT /skills/:id — Manually update skill status
router.put("/:id", async (req, res) => {
    try {
        const updated = await Skill.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Skill not found." });

        res.json(updated);
    } catch (err) {
        console.error("❌ Update skill error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST /skills/resend/:id — Resend verification email
router.post("/resend/:id", async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) return res.status(404).json({ error: "Skill not found." });

        await sendVerificationEmail(skill);

        res.json({ message: "Verification email resent successfully." });
    } catch (err) {
        console.error("❌ Resend email error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /skills/blockchain — Fetch all skills stored on the blockchain
router.get("/blockchain", async (req, res) => {
    try {
        const raw = await getSkillsFromBlockchain();

        const skills = raw.map((s) => ({
            name: s[0],
            user: s[1],
            verified: s[2],
        }));

        res.json(skills);
    } catch (err) {
        console.error("❌ Blockchain fetch error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /skills/user/:id — Public resume API (only accepted skills)
router.get("/user/:id", async (req, res) => {
    try {
        const skills = await Skill.find({
            user: req.params.id,
            status: "Accepted",
        });

        res.json(skills);
    } catch (err) {
        console.error("❌ Public resume fetch error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;