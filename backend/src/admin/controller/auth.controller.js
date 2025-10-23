import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { rejectResponseMessage, successResponseMessage } from "../../constants/response.constants.js"
import { HttpStatusCodes } from "../../constants/statusCode.constants.js"
import { adminLoginValidation, adminRegistrationValidation, resetCredentialsValidation } from "../../utils/adminValidation.utils.js"
import { handleResponse } from "../../utils/responseHandler.utils.js"
import Admin from "../models/admin.model.js"

export const adminRegistration = async (req, res, next) => {
  try {

    //req validation
    const { error, value } = adminRegistrationValidation.validate(req.body, { abortEarly: true })
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message)

    //check if userName or email already exist
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: value.email },
        { userName: value.user_name }
      ]
    })

    if (existingAdmin) {
      if (existingAdmin.user_name === value.user_name) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userNameAlreadyExist);
      if (existingAdmin.email === value.email) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.emailAlreadyExist)
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Get the creator admin ID from auth middleware
    const createdBy = req.auth?.id || null;

    //create new admin in DB
    const newAdmin = await Admin.create({
      user_name: value.user_name,
      email: value.email,
      password: hashedPassword,
      createdBy: createdBy
    })

    let resData = {
      id: newAdmin._id,
      user_name: newAdmin.user_name,
      email: newAdmin.email,
      createdBy: newAdmin.createdBy,
      createdAt: newAdmin.createdAt
    }

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.adminCreated, resData);

  } catch (error) {
    next(error)
  }
}

export const adminLogin = async (req, res, next) => {
  try {
    //  Validate input
    const { error, value } = adminLoginValidation.validate(req.body, { abortEarly: true });
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message);

    const { identifier, password } = value;

    // Find admin by email OR username
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { user_name: identifier }]
    });

    if (!admin)
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, rejectResponseMessage.invalidCredentials);

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.invalidCredentials);

    // Generate JWT Token (expires in 1 day)
    const token = jwt.sign(
      { id: admin._id, userName: admin.user_name, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    const resData = {
      id: admin._id,
      user_name: admin.user_name,
      email: admin.email,
      role: admin.role,
      token
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.loginSuccess, resData);
  } catch (error) {
    next(error);
  }
};

export const resetCredentials = async (req, res, next) => {
  try {
    const adminId = req.admin._id; // Assume admin is authenticated

    // Validate input (at least one field must be provided)
    const { error, value } = resetCredentialsValidation.validate(req.body, { abortEarly: true });
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message);

    const updateData = {};

    // Update username if provided
    if (value.admin_name) {
      // Check if username already exists
      const existingAdmin = await Admin.findOne({
        _id: { $ne: adminId },
        user_name: value.admin_name
      });
      if (existingAdmin) {
        return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userNameAlreadyExist);
      }
      updateData.user_name = value.user_name;
    }

    // Update password if provided
    if (value.new_password) {
      const hashedPassword = await bcrypt.hash(value.new_password, 10);
      updateData.password = hashedPassword;
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, "No fields provided to update");
    }

    // Update admin in DB
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true }
    );

    // Prepare response
    const resData = {
      id: updatedAdmin._id,
      user_name: updatedAdmin.user_name,
      email: updatedAdmin.email
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.credentialsUpdated, resData);
  } catch (error) {
    next(error)
  }
}



// GET ALL ADMINS
export const getAllAdmins = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find({})
        .populate('createdBy', 'user_name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select('-password'), // Exclude password from response
      Admin.countDocuments({})
    ]);

    if (!admins.length) return handleResponse(res, HttpStatusCodes.NO_CONTENT, "No admins found");

    const pagination = {
      total,
      page,
      pages: Math.ceil(total / limit)
    };

    return handleResponse(res, HttpStatusCodes.OK, "Admins fetched successfully", { pagination, admins });
  } catch (error) {
    next(error);
  }
};

//image api needed for banner

// CREATE DEFAULT ADMIN (no authentication required)
export const createDefaultAdmin = async (req, res, next) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, "Default admin already exists. Use regular registration endpoint.");
    }

    //req validation
    const { error, value } = adminRegistrationValidation.validate(req.body, { abortEarly: true })
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message)

    //hashing the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    //create new admin in DB (no createdBy since this is the first admin)
    const newAdmin = await Admin.create({
      user_name: value.user_name,
      email: value.email,
      password: hashedPassword,
      createdBy: null // First admin has no creator
    })

    let resData = {
      id: newAdmin._id,
      user_name: newAdmin.user_name,
      email: newAdmin.email,
      createdBy: newAdmin.createdBy,
      createdAt: newAdmin.createdAt
    }

    return handleResponse(res, HttpStatusCodes.CREATED, "Default admin created successfully", resData);

  } catch (error) {
    next(error)
  }
}

// CREATE ADMIN WITHOUT AUTH (for emergency admin creation)
export const createAdminWithoutAuth = async (req, res, next) => {
  try {
    //req validation
    const { error, value } = adminRegistrationValidation.validate(req.body, { abortEarly: true })
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message)

    //check if userName or email already exist
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: value.email },
        { userName: value.user_name }
      ]
    })

    if (existingAdmin) {
      if (existingAdmin.user_name === value.user_name) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userNameAlreadyExist);
      if (existingAdmin.email === value.email) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.emailAlreadyExist)
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    //create new admin in DB (no createdBy since this is emergency creation)
    const newAdmin = await Admin.create({
      user_name: value.user_name,
      email: value.email,
      password: hashedPassword,
      createdBy: null // Emergency admin has no creator
    })

    let resData = {
      id: newAdmin._id,
      user_name: newAdmin.user_name,
      email: newAdmin.email,
      createdBy: newAdmin.createdBy,
      createdAt: newAdmin.createdAt
    }

    return handleResponse(res, HttpStatusCodes.CREATED, "Emergency admin created successfully", resData);

  } catch (error) {
    next(error)
  }
}

// CREATE SUPER ADMIN (no authentication required - highest privilege)
export const createSuperAdmin = async (req, res, next) => {
  try {
    //req validation
    const { error, value } = adminRegistrationValidation.validate(req.body, { abortEarly: true })
    if (error) return handleResponse(res, HttpStatusCodes.BAD_REQUEST, error.message)

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, "Super admin already exists. Only one super admin is allowed.");
    }

    //check if userName or email already exist
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: value.email },
        { userName: value.user_name }
      ]
    })

    if (existingAdmin) {
      if (existingAdmin.user_name === value.user_name) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.userNameAlreadyExist);
      if (existingAdmin.email === value.email) return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.emailAlreadyExist)
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(value.password, 10);

    //create new super admin in DB
    const newSuperAdmin = await Admin.create({
      user_name: value.user_name,
      email: value.email,
      password: hashedPassword,
      role: 'super_admin',
      createdBy: null // Super admin has no creator
    })

    let resData = {
      id: newSuperAdmin._id,
      user_name: newSuperAdmin.user_name,
      email: newSuperAdmin.email,
      role: newSuperAdmin.role,
      createdBy: newSuperAdmin.createdBy,
      createdAt: newSuperAdmin.createdAt
    }

    return handleResponse(res, HttpStatusCodes.CREATED, "Super admin created successfully", resData);

  } catch (error) {
    next(error)
  }
}

// DELETE ADMIN (with super admin protection)
export const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.id;
    const currentAdmin = req.auth;

    // Check if admin exists
    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return handleResponse(res, HttpStatusCodes.NOT_FOUND, "Admin not found");
    }

    // Prevent deletion of super admin
    if (adminToDelete.role === 'super_admin') {
      return handleResponse(res, HttpStatusCodes.FORBIDDEN, "Cannot delete super admin account");
    }

    // Only super admin can delete other admins
    if (currentAdmin.role !== 'super_admin') {
      return handleResponse(res, HttpStatusCodes.FORBIDDEN, "Only super admin can delete admin accounts");
    }

    // Prevent self-deletion
    if (adminToDelete._id.toString() === currentAdmin.id) {
      return handleResponse(res, HttpStatusCodes.FORBIDDEN, "Cannot delete your own account");
    }

    // Delete the admin
    await Admin.findByIdAndDelete(adminId);

    return handleResponse(res, HttpStatusCodes.OK, "Admin deleted successfully");

  } catch (error) {
    next(error);
  }
}
