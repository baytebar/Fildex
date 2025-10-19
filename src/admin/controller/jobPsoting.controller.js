import mongoose from "mongoose";
import JobPosting from "../models/jobPosting.model.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";
import {
  successResponseMessage,
  rejectResponseMessage,
} from "../../constants/response.constants.js";

// Helper
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ----------------------------
// 1️⃣ Get All Job Postings
// ----------------------------
export const getAllJobPostings = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ isDeleted: false })
      .populate("created_by", "name email")
      .populate("department", "name")
      .populate("role", "name");

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.dataFetched,
      jobs
    );
  } catch (error) {
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
// 2️⃣ Get Job Posting By ID
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
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.serverError,
      error.message
    );
  }
};

// ----------------------------
// 3️⃣ Create Job Posting
// ----------------------------
export const createJobPosting = async (req, res) => {
  try {
    const {
      created_by,
      role,
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

    // Basic validation
    if (
      !created_by ||
      !role ||
      !job_title ||
      !department ||
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
        rejectResponseMessage.MISSING_FIELDS
      );
    }

    // Validate ObjectIds
    if (
      !isValidObjectId(created_by) ||
      !isValidObjectId(role) ||
      !isValidObjectId(department)
    ) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidId
      );
    }

    // Check duplicate job title in same department
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

    const newJob = new JobPosting({
      created_by,
      role,
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
    return handleResponse(
      res,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      rejectResponseMessage.SERVER_ERROR,
      error.message
    );
  }
};

// ----------------------------
// 4️⃣ Update Job Posting
// ----------------------------
export const updateJobPosting = async (req, res, next) => {
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
      successResponseMessage.UPDATED,
      job
    );
  } catch (error) {
    next(error)
  }
};

export const deleteJobPosting = async (req, res, next) => {
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
    next(error)
  }
};

