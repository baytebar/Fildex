import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
},{timestamp : true})

export default mongoose.model("admin", adminSchema);