const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

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
