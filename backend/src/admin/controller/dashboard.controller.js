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

    // Fetch paginated users with populated fields
    const users = await User.find()
      .populate('intrestRoles', 'name')
      .skip(skip)
      .limit(limit);

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

    const user = await User.findById(id).populate('intrestRoles', 'name');
    if (!user) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noUserFound)

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.userfetched, user)
  } catch (error) {
    next(error)
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.idRequired)
    if (!status) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, 'Status is required')

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidIdFormat);

    // Validate status value
    const validStatuses = ['new', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected', 'on_hold'];
    if (!validStatuses.includes(status)) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, `Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true, select: '-password' }
    ).populate('intrestRoles', 'name');

    if (!updatedUser) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noUserFound)

    return handleResponse(res, HttpStatusCodes.OK, 'User status updated successfully', updatedUser)
  } catch (error) {
    next(error)
  }
}