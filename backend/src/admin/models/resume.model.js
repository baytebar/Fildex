import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      number: {
        type: String,
        required: true,
      },
      country_code: {
        type: String,
        required: false,
        trim: true,
      }
    },
    "resume-link": {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'new',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("resume", resumeSchema);