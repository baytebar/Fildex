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
  jobTitles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'job_titles',
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
  password: { type: String, required: true },

},{timestamps : true})

export default mongoose.model("user", userSchema);