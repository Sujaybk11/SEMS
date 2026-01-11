const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock users for development (when DB is not available)
const mockUsers = [
  {
    _id: "admin123",
    name: "Admin User",
    email: "admin@sems.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    role: "admin"
  },
  {
    _id: "faculty123",
    name: "Faculty Member",
    email: "faculty@sems.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    role: "faculty"
  },
  {
    _id: "student123",
    name: "Student User",
    email: "student@sems.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    role: "student"
  }
];

// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try database first, fallback to mock users
    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbError) {
      // Database not available, use mock users
      user = mockUsers.find(u => u.email === email);
    }
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
