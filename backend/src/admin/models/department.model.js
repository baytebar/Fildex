import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
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
  status: {
    type: String,
    enum: ['active', 'hold', 'inactive'],
    default: 'active',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

export default mongoose.model('department', departmentSchema);
