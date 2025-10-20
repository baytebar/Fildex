import Department from "../models/department.model.js";
import JobPosting from "../models/jobPosting.model.js";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";
import { successResponseMessage, rejectResponseMessage } from "../../constants/response.constants.js";

// ----------------------------
// Helper Validation Functions
// ----------------------------
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ----------------------------
// Get All Departments with Job Postings
// ----------------------------
export const getAllDepartments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDepartments = await Department.countDocuments({ isDeleted: false });
    const departments = await Department.find({ isDeleted: false })
      .populate("created_by", "user_name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalDepartments / limit);

    // Get job postings data
    let jobPostingsData = null;
    try {
      const jobPage = parseInt(req.query.page) || 1;
      const jobLimit = parseInt(req.query.limit) || 10;
      const jobSkip = (jobPage - 1) * jobLimit;

      const totalJobs = await JobPosting.countDocuments({ isDeleted: false });
      const jobs = await JobPosting.find({ isDeleted: false })
        .populate("created_by", "user_name email")
        .populate("department", "name")
        .populate("role", "name")
        .skip(jobSkip)
        .limit(jobLimit)
        .sort({ createdAt: -1 });

      const jobTotalPages = Math.ceil(totalJobs / jobLimit);
      
      jobPostingsData = {
        jobs,
        pagination: {
          currentPage: jobPage,
          totalPages: jobTotalPages,
          totalJobs,
          hasNextPage: jobPage < jobTotalPages,
          hasPrevPage: jobPage > 1
        }
      };
    } catch (jobError) {
      console.error("Error fetching job postings:", jobError);
      // Continue without job postings data if there's an error
    }

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.dataFetched, {
      departments,
      jobPostings: jobPostingsData,
      pagination: {
        currentPage: page,
        totalPages,
        totalDepartments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    next(error)
  }
};

// ----------------------------
// Get Department by ID
// ----------------------------
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidId);
    }

    const department = await Department.findOne({ _id: id, isDeleted: false }).populate("created_by", "user_name email");
    if (!department) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.departmentNotFound);
    }

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.dataFetched, department);
  } catch (error) {
    next(error)
  }
};

// ----------------------------
// Create Department
// ----------------------------
export const createDepartment = async (req, res, next) => {
  try {
    console.log('Create department request body:', req.body);
    const { name } = req.body;
    
    // Get created_by from auth middleware
    const created_by = req.auth.id;

    if (!name) {
      console.log('Missing fields - name:', name);
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.missingFields);
    }

    // Normalize and check if department already exists (case-insensitive)
    const normalizedName = name.trim();
    const existing = await Department.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      isDeleted: false
    });
    if (existing) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }

    const newDepartment = new Department({ name: normalizedName, created_by });
    await newDepartment.save();

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.CREATED, newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    // Gracefully handle duplicate key errors
    if (error && (error.code === 11000 || error.codeName === 'DuplicateKey')) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }
    next(error)
  }
};

// ----------------------------
// Update Department
// ----------------------------
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!isValidObjectId(id)) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidId);
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, "Department name is required and must be a string.");
    }

    const department = await Department.findOne({ _id: id, isDeleted: false });
    if (!department) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.departmentNotFound);
    }

    // Check for duplicate name (case-insensitive)
    const normalizedName = name.trim();
    const duplicate = await Department.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
      _id: { $ne: id },
      isDeleted: false
    });
    if (duplicate) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }

    department.name = normalizedName;
    await department.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.updated, department);
  } catch (error) {
    // Gracefully handle duplicate key errors
    if (error && (error.code === 11000 || error.codeName === 'DuplicateKey')) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }
    next(error)
  };
}

// ----------------------------
// Soft Delete Department
// ----------------------------
export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidId);
    }

    const department = await Department.findOne({ _id: id, isDeleted: false });
    if (!department) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.departmentNotFound);
    }

    department.isDeleted = true;
    await department.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.deleted, { id: department._id });
  } catch (error) {
    next(error)
  }
};










