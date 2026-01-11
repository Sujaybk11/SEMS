const Exam = require("../models/Exam");

// Faculty: Create Exam
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Approve Exam
exports.approveExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.status = "approved";
    await exam.save();

    res.json({ message: "Exam approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: View Approved Exams
exports.getApprovedExams = async (req, res) => {
  try {
    const exams = await Exam.find({ status: "approved" });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FACULTY: Get faculty's own exams
exports.getFacultyExams = async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};