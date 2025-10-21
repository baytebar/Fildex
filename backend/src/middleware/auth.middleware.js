import jwt from "jsonwebtoken";
import { handleResponse } from "../utils/responseHandler.utils.js";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";
import Admin from "../admin/models/admin.model.js";
import User from "../models/user.model.js";
import { rejectResponseMessage } from "../constants/response.constants.js";

export const authenticate = async (req, res, next) => {
  
  try {
    //  Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    //  Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.tokenExpired);
      }
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.invalidToken);
    }

    //  Identify role and fetch user/admin
    let authUser = null;
    let role = "user"; // default

    if (decoded.role === "admin" || decoded.role === "super_admin") {
      authUser = await Admin.findById(decoded.id).select("-password");
      role = authUser.role; // Use the actual role from database
    } else {
      authUser = await User.findById(decoded.id).select("-password");
    }

    if (!authUser) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.invalidTokenOrUserNotFound);
    }

    //  Attach to request
    req.auth = {
      id: authUser._id,
      role,
      ...authUser.toObject(),
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware
export const authorizeRoles = (...allowedRoles) => {
  
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return handleResponse(res, HttpStatusCodes.FORBIDDEN, rejectResponseMessage.accessDenied);
    }
    next();
  };
};

// Admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
  if (!req.auth || (req.auth.role !== 'admin' && req.auth.role !== 'super_admin')) {
    return handleResponse(res, HttpStatusCodes.FORBIDDEN, rejectResponseMessage.accessDenied);
  }
  next();
};

// Super admin authorization middleware
export const authorizeSuperAdmin = (req, res, next) => {
  if (!req.auth || req.auth.role !== 'super_admin') {
    return handleResponse(res, HttpStatusCodes.FORBIDDEN, "Only super admin access allowed");
  }
  next();
};

// Super admin creation token middleware
export const validateSuperAdminCreationToken = (req, res, next) => {
  try {
    const token = req.headers['x-super-admin-token'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!token) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Super admin creation token required");
    }

    // Check against environment variable
    const validToken = process.env.SUPER_ADMIN_CREATION_TOKEN || 'super_admin_secure_token_2024_fildex';
    
    if (token !== validToken) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Invalid super admin creation token");
    }

    next();
  } catch (error) {
    return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, "Invalid token format");
  }
};
