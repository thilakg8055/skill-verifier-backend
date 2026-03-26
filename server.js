const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
const PORT = process.env.PORT || 5001;


// const app = express();
// app.use(cors({
//     origin: function (origin, callback) {
//         const allowed = [
//             "http://localhost:3000",
//             "https://skill-verifier-frontend-2uqm.vercel.app"
//         ];
//         if (!origin || allowed.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     }
// }));

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://skill-verifier-frontend-2uqm.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//     next();
// });



app.use(express.json());
app.use("/api/auth", authRoutes);



app.use("/api/skills", require("./routes/skillRoutes"));
// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🔥 MongoDB Connected"))
    .catch(err => console.log("❌ Error:", err));

// test route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

