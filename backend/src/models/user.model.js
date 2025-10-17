import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  intrestRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_intrest_roles',
    required: false, 
  }],
  contact: {
    number: {
      type: Number,
      required: false,
      unique: true,
      sparse: true,
    },
    country_code: {
      type: String,
      required: false,
      trim: true,
    }
  },
  cv: {
    url: { type: String, trim: true, },
    new: { type: Boolean, default: true },
  },
  status: {
    type: String,
    enum: ['new', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected', 'on_hold'],
    default: 'new',
    required: false
  },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

},{timestamps : true})

export default mongoose.model("user", userSchema);