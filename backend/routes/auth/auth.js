import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

import User from "../../models/users/users.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import { verifyToken, verifyTokenAndAdmin } from "../../middleware/verifyToken.js";

const router = express.Router();

// ===== Multer memory storage =====
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "profilePic", maxCount: 1 },
]);

// ===== REGISTER (Normal or Admin) =====
router.post("/register", upload, async (req, res) => {
  try {
    const { email, studentname, password, college_year, department, isAdmin } = req.body;

    if (!email || !studentname || !password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (await User.findOne({ studentname })) {
      return res.status(400).json({ message: "Username already exists" });
    }

    let profilePic = { url: "", publicId: "" };
    if (req.files?.profilePic?.[0]) {
      const result = await uploadToCloudinary(req.files.profilePic[0], "profiles");
      profilePic = { url: result.secure_url, publicId: result.public_id };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      studentname,
      password: hashedPassword,
      profilePic,
      college_year,
      department,
      isAdmin: isAdmin === "true",
      verificationStatus: isAdmin === "true" ? "verified" : "unverified", // <-- ✅ If verified shows bluetick
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, studentname: savedUser.studentname, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = savedUser._doc;
    res.status(201).json({ ...userWithoutPassword, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { studentname, password } = req.body;
    const user = await User.findOne({ studentname });
    if (!user) return res.status(400).json({ message: "Invalid studentname or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, studentname: user.studentname, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});



// ===== LOGOUT =====
router.post("/logout", verifyToken, async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({ message: "Successfully logged out", success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== VERIFY =====
router.get("/verify", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Verify route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
