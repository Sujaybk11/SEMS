const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    examDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // minutes
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
