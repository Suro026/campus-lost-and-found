const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Register
router.post("/register", async (req, res) => {
    const { username, phone, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            phone,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;