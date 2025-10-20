import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_intrest_roles",
      required: false,
    },

    job_title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: false,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    job_type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      required: true,
    },

    experience: {
      type: String,
      enum: ["fresher", "experienced"],
      required: true,
    },

    salary_range: {
      type: String, // e.g. "₹30,000 - ₹50,000"
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      required: true,
    },

    contact_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },

    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("job_posting", jobPostingSchema);
