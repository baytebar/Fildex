import mongoose from "mongoose";
import JobPosting from "../models/jobPosting.model.js";
import Admin from "../models/admin.model.js";
import JobTitle from "../models/jobTitle.model.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";
import {
  successResponseMessage,
  rejectResponseMessage,
} from "../../constants/response.constants.js";

// Helper
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ----------------------------
//  Get All Job Postings with Pagination
// ----------------------------
export const getAllJobPostings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalJobs = await JobPosting.countDocuments({ isDeleted: false });
    const jobs = await JobPosting.find({ isDeleted: false })
      .populate("created_by", "name email")
      .populate("department", "name")
      .populate("role", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalJobs / limit);

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.dataFetched,
      {
        jobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    );
  } catch (error) {
    console.error("Error in getAllJobPostings:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
//  Get Job Posting By ID
// ----------------------------
export const getJobPostingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    const job = await JobPosting.findOne({ _id: id, isDeleted: false })
      .populate("created_by", "name email")
      .populate("department", "name")
      .populate("role", "name");

    if (!job) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.dataNotFound
      );
    }

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.dataFetched,
      job
    );
  } catch (error) {
    console.error("Error in getJobPostingById:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
//  Create Job Posting
// ----------------------------
export const createJobPosting = async (req, res) => {
  try {
    const {
      job_title,
      department,
      location,
      job_type,
      experience,
      salary_range,
      deadline,
      description,
      requirements,
      contact_email,
      status,
    } = req.body;

    // Get created_by from auth middleware
    const created_by = req.auth.id;

    // Basic validation
    if (
      !job_title ||
      !location ||
      !job_type ||
      !experience ||
      !deadline ||
      !description ||
      !requirements ||
      !contact_email
    ) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.missingFields
      );
    }

    // Validate ObjectIds - make department optional for now
    if (department && !isValidObjectId(department)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    // Check duplicate job title in same department (if department is provided)
    if (department) {
      const existingJob = await JobPosting.findOne({
        job_title: job_title.trim(),
        department,
        isDeleted: false,
      });
      if (existingJob) {
        return handleResponse(
          res,
          HttpStatusCodes.CONFLICT,
          "Job with this title already exists in the department."
        );
      }
    }

    const newJob = new JobPosting({
      created_by,
      job_title: job_title.trim(),
      department,
      location,
      job_type,
      experience,
      salary_range,
      deadline,
      description,
      requirements,
      contact_email,
      status,
    });

    await newJob.save();

    return handleResponse(
      res,
      HttpStatusCodes.CREATED,
      successResponseMessage.CREATED,
      newJob
    );
  } catch (error) {
    console.error("Error in createJobPosting:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
// Update Job Posting
// ----------------------------
export const updateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    const job = await JobPosting.findOne({ _id: id, isDeleted: false });
    if (!job) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.dataNotFound
      );
    }

    const updatableFields = [
      "job_title",
      "department",
      "location",
      "job_type",
      "experience",
      "salary_range",
      "deadline",
      "description",
      "requirements",
      "contact_email",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.updated,
      job
    );
  } catch (error) {
    console.error("Error in updateJobPosting:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

export const deleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    const job = await JobPosting.findOne({ _id: id, isDeleted: false });
    if (!job) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.dataNotFound
      );
    }

    job.isDeleted = true;
    await job.save();

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.deleted,
      { id: job._id }
    );
  } catch (error) {
    console.error("Error in deleteJobPosting:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
// Pause Job Posting
// ----------------------------
export const pauseJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    const job = await JobPosting.findOne({ _id: id, isDeleted: false });
    if (!job) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.dataNotFound
      );
    }

    job.status = 'paused';
    await job.save();

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      "Job posting paused successfully",
      { id: job._id, status: 'paused' }
    );
  } catch (error) {
    console.error("Error in pauseJobPosting:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
// Resume Job Posting
// ----------------------------
export const resumeJobPosting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    const job = await JobPosting.findOne({ _id: id, isDeleted: false });
    if (!job) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.dataNotFound
      );
    }

    job.status = 'active';
    await job.save();

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      "Job posting resumed successfully",
      { id: job._id, status: 'active' }
    );
  } catch (error) {
    console.error("Error in resumeJobPosting:", error);
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};
