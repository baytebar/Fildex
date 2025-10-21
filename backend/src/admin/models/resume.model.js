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
        required: false,
        default: "",
      },
      country_code: {
        type: String,
        required: false,
        trim: true,
        default: "",
      }
    },
    role: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    "resume-link": {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected', 'on_hold'],
      default: 'new',
      required: true,
    },
    expiryDate: {
      type: Date,
      required: false,
      default: function() {
        // Set default expiry to 90 days from now
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        return ninetyDaysFromNow;
      }
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("resume", resumeSchema);