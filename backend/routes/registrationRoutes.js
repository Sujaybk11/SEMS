const express = require("express");
const router = express.Router();

const {
  registerExam,
  withdrawExam,
  getMyRegistrations,
  getFacultyRegistrations,
  getAllRegistrations,
} = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/register/:examId", protect, authorizeRoles("student"), registerExam);
router.delete("/withdraw/:examId", protect, authorizeRoles("student"), withdrawExam);
router.get("/my", protect, authorizeRoles("student"), getMyRegistrations);
router.get("/faculty", protect, authorizeRoles("faculty"), getFacultyRegistrations);
router.get("/all", protect, authorizeRoles("admin"), getAllRegistrations);

module.exports = router;