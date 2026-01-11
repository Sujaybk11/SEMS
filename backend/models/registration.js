const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "withdrawn"],
      default: "registered",
    },
  },
  { timestamps: true }
);

// Prevent duplicate registration
registrationSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
