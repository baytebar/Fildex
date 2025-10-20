import { rejectResponseMessage, successResponseMessage } from "../../constants/response.constants.js"
import { HttpStatusCodes } from "../../constants/statusCode.constants.js"
import { handleResponse } from "../../utils/responseHandler.utils.js"
import JobTitle from "../models/jobTitle.model.js";

// CREATE
export const createJobTitle = async (req, res, next) => {
  try {
    const adminId = req.auth.id; // populated from auth middleware
    if (!adminId) return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Unauthorized");

    const { name } = req.body;
    //validating the req.body
    if (!name || typeof name !== "string" || !name.trim())
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.roleNameRequired);

    const existingJobTitle = await JobTitle.findOne({ name, isDeleted: false });
    if (existingJobTitle) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.roleAlreadyExist);

    const newJobTitle = await JobTitle.create({
      name: name.trim(),
      created_by: adminId
    });

    const resData = {
      _id: newJobTitle._id,
      name: newJobTitle.name,
      created_by: newJobTitle.created_by,
      isDeleted: newJobTitle.isDeleted,
      createdAt: newJobTitle.createdAt,
      updatedAt: newJobTitle.updatedAt
    };

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.jobTitleCreated, resData);
  } catch (error) {
    next(error);
  }
};

// GET ALL (with optional pagination)
export const getAllJobTitles = async (req, res, next) => {
  try {
    // Check if pagination parameters are provided
    const usePagination = req.query.page || req.query.limit;
    
    if (usePagination) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [jobTitles, total] = await Promise.all([
        JobTitle.find({})
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        JobTitle.countDocuments({})
      ]);

      if (!jobTitles.length) return handleResponse(res, HttpStatusCodes.NO_CONTENT, rejectResponseMessage.noJobTitlesFound);

      const pagination = {
        total,
        page,
        pages: Math.ceil(total / limit)
      };

      return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitlesFetched, { pagination, jobTitles });
    } else {
      // Return all job titles without pagination (both active and paused)
      const jobTitles = await JobTitle.find({}).sort({ createdAt: -1 });
      
      if (!jobTitles.length) return handleResponse(res, HttpStatusCodes.NO_CONTENT, rejectResponseMessage.noJobTitlesFound);
      
      return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitlesFetched, jobTitles);
    }
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getJobTitleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.idRequired);

    const jobTitle = await JobTitle.findOne({ _id: id, isDeleted: false });
    if (!jobTitle) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noJobTitlesFound);

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitleFetched, jobTitle);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateJobTitle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    //validating the req.body
    if (!name || typeof name !== "string" || !name.trim())
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.roleNameRequired);

    const existingJobTitle = await JobTitle.findOne({ _id: id, isDeleted: false });
    if (!existingJobTitle) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noJobTitlesFound);

    if (name) {
      const duplicate = await JobTitle.findOne({ name, _id: { $ne: id }, isDeleted: false });
      if (duplicate) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.roleAlreadyExist);
      existingJobTitle.name = name.trim();
    }

    await existingJobTitle.save();

    const resData = {
      _id: existingJobTitle._id,
      name: existingJobTitle.name,
      created_by: existingJobTitle.created_by,
      isDeleted: existingJobTitle.isDeleted,
      createdAt: existingJobTitle.createdAt,
      updatedAt: existingJobTitle.updatedAt
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitleUpdated, resData);
  } catch (error) {
    next(error);
  }
};

// DELETE (soft delete) - Pause
export const deleteJobTitle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobTitle = await JobTitle.findOne({ _id: id, isDeleted: false });
    if (!jobTitle) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noJobTitlesFound);

    jobTitle.isDeleted = true;
    await jobTitle.save();

    const resData = {
      _id: jobTitle._id,
      name: jobTitle.name,
      created_by: jobTitle.created_by,
      isDeleted: jobTitle.isDeleted,
      createdAt: jobTitle.createdAt,
      updatedAt: jobTitle.updatedAt
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitleDeleted, resData);
  } catch (error) {
    next(error);
  }
};

// RESUME (unpause)
export const resumeJobTitle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobTitle = await JobTitle.findOne({ _id: id, isDeleted: true });
    if (!jobTitle) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noJobTitlesFound);

    jobTitle.isDeleted = false;
    await jobTitle.save();

    const resData = {
      _id: jobTitle._id,
      name: jobTitle.name,
      created_by: jobTitle.created_by,
      isDeleted: jobTitle.isDeleted,
      createdAt: jobTitle.createdAt,
      updatedAt: jobTitle.updatedAt
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.jobTitleUpdated, resData);
  } catch (error) {
    next(error);
  }
};
