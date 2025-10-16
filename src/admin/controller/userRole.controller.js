import { rejectResponseMessage, successResponseMessage } from "../../constants/response.constants.js"
import { HttpStatusCodes } from "../../constants/statusCode.constants.js"
import { handleResponse } from "../../utils/responseHandler.utils.js"
import UserInterestRoles from "../models/intrestRoles.model.js";

// CREATE
export const createInterestRole = async (req, res, next) => {
  try {
    const adminId = req.auth.id; // populated from auth middleware
    if (!adminId) return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Unauthorized");

    const { name } = req.body;
    //validating the req.body
    if (!name || typeof name !== "string" || !name.trim())
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.roleNameRequired);

    const existingRole = await UserInterestRoles.findOne({ name, isDeleted: false });
    if (existingRole) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.roleAlreadyExist);

    const newRole = await UserInterestRoles.create({
      name: name.trim(),
      created_by: adminId
    });

    const resData = {
      id: newRole._id,
      name: newRole.name,
      createdBy: newRole.created_by
    };

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.instrestRoleCreated, resData);
  } catch (error) {
    next(error);
  }
};

// GET ALL (with pagination)
export const getAllInterestRoles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      UserInterestRoles.find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      UserInterestRoles.countDocuments({ isDeleted: false })
    ]);

    if (!roles.length) return handleResponse(res, HttpStatusCodes.NO_CONTENT, rejectResponseMessage.noRolesFound);

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit)
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.roleFetched, { pagination, roles });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getInterestRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.idRequired);

    const role = await UserInterestRoles.findOne({ _id: id, isDeleted: false });
    if (!role) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noRolesFound);

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.roleFetched, role);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateInterestRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    //validating the req.body
    if (!name || typeof name !== "string" || !name.trim())
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.roleNameRequired);

    const existingRole = await UserInterestRoles.findOne({ _id: id, isDeleted: false });
    if (!existingRole) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noRolesFound);

    if (name) {
      const duplicate = await UserInterestRoles.findOne({ name, _id: { $ne: id }, isDeleted: false });
      if (duplicate) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.roleAlreadyExist);
      existingRole.name = name.trim();
    }

    await existingRole.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.roleUpdated, existingRole);
  } catch (error) {
    next(error);
  }
};

// DELETE (soft delete)
export const deleteInterestRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await UserInterestRoles.findOne({ _id: id, isDeleted: false });
    if (!role) return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.noRolesFound);

    role.isDeleted = true;
    await role.save();

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.roleDeleted);
  } catch (error) {
    next(error);
  }
};