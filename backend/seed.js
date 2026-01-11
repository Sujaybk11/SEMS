const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Exam = require("./models/Exam");
const Registration = require("./models/registration");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
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

    console.log("Users created successfully");

    // Create sample exams
    const faculty = users.find(user => user.role === "faculty");
    
    const exams = await Exam.create([
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
      },
      {
        courseCode: "PHY301",
        courseName: "Quantum Physics",
        examDate: new Date("2024-02-25"),
        duration: 150,
        capacity: 30,
        semester: 3,
        createdBy: faculty._id,
        status: "pending"
      }
    ]);

    console.log("Exams created successfully");

    console.log("\n=== SEED DATA COMPLETED ===");
    console.log("Login Credentials:");
    console.log("Admin: admin@sems.com / password123");
    console.log("Faculty: faculty@sems.com / password123");
    console.log("Student: student@sems.com / password123");
    console.log("===============================\n");

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();