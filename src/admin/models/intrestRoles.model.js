import mongoose from "mongoose";

const userInstrestRolesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  created_by : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

export default mongoose.model('user_intrest_roles', userInstrestRolesSchema);