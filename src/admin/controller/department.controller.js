import Department from "../models/department.model.js";
import mongoose from "mongoose";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";
import { successResponseMessage, rejectResponseMessage } from "../../constants/response.constants.js";

// ----------------------------
// Helper Validation Functions
// ----------------------------
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ----------------------------
// Get All Departments
// ----------------------------
export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isDeleted: false }).populate("created_by", "name email");
    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.dataFetched, departments);
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
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.INVALID_ID);
    }

    const department = await Department.findOne({ _id: id, isDeleted: false }).populate("created_by", "name email");
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
    const { name, created_by } = req.body;

    if (!name || !created_by) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.missingFeilds);
    }

    if (!isValidObjectId(created_by)) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.invalidId);
    }

    // Check if department already exists
    const existing = await Department.findOne({ name: name.trim(), isDeleted: false });
    if (existing) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }

    const newDepartment = new Department({ name: name.trim(), created_by });
    await newDepartment.save();

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.CREATED, newDepartment);
  } catch (error) {
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

    // Check for duplicate name
    const duplicate = await Department.findOne({ name: name.trim(), _id: { $ne: id }, isDeleted: false });
    if (duplicate) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.departmentAlreadyExist);
    }

    department.name = name.trim();
    await department.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.updated, department);
  } catch (error) {
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
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.departmentAlreadyExist);
    }

    department.isDeleted = true;
    await department.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.deleted, { id: department._id });
  } catch (error) {
    next(error)
  }
};
