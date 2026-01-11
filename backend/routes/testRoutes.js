const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Exam = require("../models/Exam");
const Registration = require("../models/registration");

// Test route
router.get("/", (req, res) => {
  res.json({ message: "SEMS Backend API is running!" });
});

// Seed database route
router.get("/seed", async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Registration.deleteMany({});

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create users
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@sems.com",
        password: hashedPassword,
        role: "admin"
      },
      {
        name: "Faculty Member",
        email: "faculty@sems.com",
        password: hashedPassword,
        role: "faculty"
      },
      {
        name: "Student User",
        email: "student@sems.com",
        password: hashedPassword,
        role: "student"
      }
    ]);

    // Create sample exams
    const faculty = users.find(user => user.role === "faculty");
    
    await Exam.create([
      {
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        examDate: new Date("2024-02-15"),
        duration: 120,
        capacity: 50,
        semester: 1,
        createdBy: faculty._id,
        status: "approved"
      },
      {
        courseCode: "MATH201",
        courseName: "Calculus II",
        examDate: new Date("2024-02-20"),
        duration: 180,
        capacity: 40,
        semester: 2,
        createdBy: faculty._id,
        status: "approved"
      }
    ]);

    res.json({
      message: "Database seeded successfully!",
      credentials: {
        admin: "admin@sems.com / password123",
        faculty: "faculty@sems.com / password123",
        student: "student@sems.com / password123"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Seeding failed", error: error.message });
  }
});

// Only logged-in users
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

// Only admin
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// Only faculty
router.get(
  "/faculty",
  protect,
  authorizeRoles("faculty"),
  (req, res) => {
    res.json({ message: "Welcome Faculty" });
  }
);

module.exports = router;
