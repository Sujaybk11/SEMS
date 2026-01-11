const express = require("express");
const router = express.Router();

const {
  createExam,
  approveExam,
  getApprovedExams,
  getAllExams,
  getFacultyExams
} = require("../controllers/examController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Faculty creates exam
router.post(
  "/create",
  protect,
  authorizeRoles("faculty"),
  createExam
);

// Admin approves exam
router.put(
  "/approve/:examId",
  protect,
  authorizeRoles("admin"),
  approveExam
);

// Student views approved exams
router.get(
  "/approved",
  protect,
  authorizeRoles("student"),
  getApprovedExams
);

// Admin views all exams
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllExams
);

// Faculty views own exams
router.get(
  "/faculty",
  protect,
  authorizeRoles("faculty"),
  getFacultyExams
);

module.exports = router;