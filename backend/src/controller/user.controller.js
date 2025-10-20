import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";
import User from "../models/user.model.js";
import JobTitle from "../admin/models/jobTitle.model.js";
import { handleResponse } from "../utils/responseHandler.utils.js";
import { updateProfileValidation } from "../utils/validator.utils.js";
import { rejectResponseMessage, successResponseMessage } from "../constants/response.constants.js";
import s3 from "../config/s3.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New function to get user profile
export const getProfile = async (req, res, next) => {
  try {
    // Get user ID from authentication middleware
    const userId = req.auth?.id;
    if (!userId)
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.unauthorized);

    // Find user by ID and exclude password field
    const user = await User.findById(userId).select("-password").populate("jobTitles");

    if (!user)
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.userNotFound);

    // Respond with success
    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.profileFetched,
      user
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // Get user ID from authentication middleware
    const userId = req.auth?.id;
    if (!userId)
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.unauthorized);

    if (typeof req.body.contact === "string") {
      req.body.contact = JSON.parse(req.body.contact);
    }
    if (typeof req.body.jobTitles === "string") {
      req.body.jobTitles = JSON.parse(req.body.jobTitles);
    }


    // Validate request body (for contact, interest roles, etc.)
    const { error, value } = updateProfileValidation.validate(req.body, { abortEarly: true });
    if (error)
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message);

    const { contact, jobTitles } = value;

    // Check for duplicate contact number
    if (contact?.number) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        "contact.number": contact.number,
      });
      if (existingUser)
        return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userAlreadyExist);
    }

    // Validate job titles
    if (jobTitles && Array.isArray(jobTitles)) {
      const validJobTitles = await JobTitle.find({
        _id: { $in: jobTitles },
        isDeleted: false,
      });
      if (validJobTitles.length !== jobTitles.length) {
        return handleResponse(
          res,
          HttpStatusCodes.BAD_REQUEST,
          rejectResponseMessage.invalidRoles
        );
      }
    }

    // Prepare update data
    const updateData = {};
    if (contact?.number) updateData["contact.number"] = contact.number;
    if (contact?.country_code) updateData["contact.country_code"] = contact.country_code;
    if (jobTitles) updateData.jobTitles = jobTitles;

    // Handle CV file upload
    if (req.file) {
      // Generate unique filename
      const fileExt = path.extname(req.file.originalname); // e.g. ".pdf"
      const fileName = `${userId}-${Date.now()}${fileExt}`;

      // Upload file to Hetzner Cloud Storage
      const params = {
        Bucket: process.env.HETZNER_BUCKET,
        Key: `user-cvs/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      // Store cloud storage URL in DB
      updateData["cv.url"] = uploadResult.Location;
      updateData["cv.new"] = true;
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser)
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.userNotFound)
    // Populate job titles
    const populatedUser = await updatedUser.populate("jobTitles");

    // Respond with success
    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.profileUpdated,
      populatedUser
    );
  } catch (error) {
    next(error);
  }
};


