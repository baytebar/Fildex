import mongoose from "mongoose";

const jobTitleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  created_by : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

export default mongoose.model('job_titles', jobTitleSchema);
