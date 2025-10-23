import mongoose from "mongoose";
import { rejectResponseMessage, successResponseMessage } from "../../constants/response.constants.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import User from "../../models/user.model.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";

export const getAllUser = async (req, res, next) => {
  try {

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // default: page 1
    const limit = parseInt(req.query.limit) || 10; // default: 10 per page

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch paginated users
    const users = await User.find().skip(skip).limit(limit);

    // Count total documents
    const totalUsers = await User.countDocuments();
    if (users.length === 0) return handleResponse(res, HttpStatusCodes.NO_CONTENT, rejectResponseMessage.noUserFound);

    // Return paginated response
    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.userfetched, {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
      users
    });
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.idRequired)

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidIdFormat);

    const user = await User.findById(id);
    if (!user) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noUserFound)

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.userfetched, user)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.idRequired)

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidIdFormat);

    const user = await User.findById(id);
    if (!user) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noUserFound)

    // Delete user's CV from cloud storage if it exists
    if (user.cv?.url) {
      try {
        // Extract the key from the URL (everything after the last slash)
        const urlParts = user.cv.url.split('/');
        const key = urlParts[urlParts.length - 1];
        
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
        const s3Client = (await import('../config/s3.config.js')).default;
        
        const params = {
          Bucket: process.env.HETZNER_BUCKET,
          Key: `user-cvs/${key}`,
        };
        
        await s3Client.send(new DeleteObjectCommand(params));
      } catch (s3Error) {
        // Log error but don't fail the deletion
      }
    }

    // Delete the user from database
    await User.findByIdAndDelete(id);

    return handleResponse(res, HttpStatusCodes.OK, "User deleted successfully");
  } catch (error) {
    next(error);
  }
}