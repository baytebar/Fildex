import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";
import User from "../models/user.model.js";
import UserInterestRoles from "../admin/models/intrestRoles.model.js";
import { handleResponse } from "../utils/responseHandler.utils.js";
import { updateProfileValidation } from "../utils/validator.utils.js";
import { rejectResponseMessage, successResponseMessage } from "../constants/response.constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    // Get user ID from authentication middleware
    const userId = req.auth?.id;
    if (!userId)
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.unauthorized);

    // Find user by ID and populate interest roles
    const user = await User.findById(userId).select("-password").populate("intrestRoles");
    
    if (!user)
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.userNotFound);

    // Respond with user data
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
    if (typeof req.body.intrestRoles === "string") {
      req.body.intrestRoles = JSON.parse(req.body.intrestRoles);
    }


    // Validate request body (for contact, interest roles, etc.)
    const { error, value } = updateProfileValidation.validate(req.body, { abortEarly: true });
    if (error)
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message);

    const { contact, intrestRoles } = value;

    // Check for duplicate contact number
    if (contact?.number) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        "contact.number": contact.number,
      });
      if (existingUser)
        return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userAlreadyExist);
    }

    // Validate interest roles
    if (intrestRoles && Array.isArray(intrestRoles)) {
      const validRoles = await UserInterestRoles.find({
        _id: { $in: intrestRoles },
        isDeleted: false,
      });
      if (validRoles.length !== intrestRoles.length) {
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
    if (intrestRoles) updateData.intrestRoles = intrestRoles;

    // Handle CV file upload
    if (req.file) {
      const uploadDir = path.join(__dirname, "../public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileExt = path.extname(req.file.originalname); // e.g. ".pdf"
      const fileName = `${userId}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      // Delete old CV if exists
      const existingUser = await User.findById(userId);
      if (existingUser?.cv?.url) {
        const oldFilePath = path.join(__dirname, "../", existingUser.cv.url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Save new file
      fs.writeFileSync(filePath, req.file.buffer);

      // Store relative path in DB (for serving via static route)
      updateData["cv.url"] = `public/uploads/${fileName}`;
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
    // Populate interest roles
    const populatedUser = await updatedUser.populate("intrestRoles");

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
