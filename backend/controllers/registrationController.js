const Exam = require("../models/Exam");
const Registration = require("../models/Registration");

/**
 * STUDENT: Register for an exam
 * - Allows re-registration after withdrawal
 * - Enforces capacity
 * - Prevents duplicate active registration
 */
exports.registerExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.status !== "approved") {
      return res.status(400).json({ message: "Exam not approved yet" });
    }

    // Check if registration already exists
    let registration = await Registration.findOne({
      student: req.user.id,
      exam: exam._id,
    });

    // If withdrawn earlier → re-register
    if (registration && registration.status === "withdrawn") {
      registration.status = "registered";
      await registration.save();
      return res.json({ message: "Re-registered successfully" });
    }

    // If already registered
    if (registration && registration.status === "registered") {
      return res
        .status(400)
        .json({ message: "Already registered for this exam" });
    }

    // Capacity check
    const registeredCount = await Registration.countDocuments({
      exam: exam._id,
      status: "registered",
    });

    if (registeredCount >= exam.capacity) {
      return res.status(400).json({ message: "Exam capacity full" });
    }

    // New registration
    await Registration.create({
      student: req.user.id,
      exam: exam._id,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STUDENT: Withdraw from exam
 */
exports.withdrawExam = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      student: req.user.id,
      exam: req.params.examId,
      status: "registered",
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = "withdrawn";
    await registration.save();

    res.json({ message: "Withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STUDENT: View my registered exams
 */
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user.id,
      status: "registered",
    }).populate("exam");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * FACULTY: View registrations for exams they created
 */
exports.getFacultyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate({
        path: "exam",
        match: { createdBy: req.user.id },
      })
      .populate("student", "name email");

    // Remove null exams (not created by this faculty)
    const filteredRegistrations = registrations.filter((r) => r.exam !== null);

    res.json(filteredRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN: View all registrations
 */
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("student", "name email")
      .populate("exam", "courseCode courseName");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
