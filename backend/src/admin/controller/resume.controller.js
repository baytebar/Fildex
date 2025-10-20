import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rejectResponseMessage, successResponseMessage } from "../../constants/response.constants.js";
import { HttpStatusCodes } from "../../constants/statusCode.constants.js";
import Resume from "../models/resume.model.js";
import { handleResponse } from "../../utils/responseHandler.utils.js";
import upload from "../../config/multer.config.js";
import s3 from "../../config/s3.config.js";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadResume = async (req, res, next) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.fileRequired
      );
    }

    // Extract data from request body
    const { name, email, contact } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.missingRequiredFields
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidEmail
      );
    }

    // Parse contact information
    let contactInfo = { number: "", country_code: "" };
    if (contact) {
      try {
        contactInfo = typeof contact === "string" ? JSON.parse(contact) : contact;
      } catch (error) {
        contactInfo = { number: contact, country_code: "" };
      }
    }

    // Validate contact number
    if (!contactInfo.number) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.missingContactNumber
      );
    }

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

    // Upload file to Hetzner Cloud Storage
    const params = {
      Bucket: process.env.HETZNER_BUCKET,
      Key: `resumes/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();
    
    // Create resume document with cloud storage URL
    const resumeData = {
      name,
      email,
      contact: contactInfo,
      "resume-link": uploadResult.Location,
    };

    const newResume = new Resume(resumeData);
    const savedResume = await newResume.save();

    // Respond with success
    return handleResponse(
      res,
      HttpStatusCodes.CREATED,
      successResponseMessage.resumeUploaded,
      savedResume
    );
  } catch (error) {
    next(error);
  }
};

export const getAllResumes = async (req, res, next) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch paginated resumes
    const resumes = await Resume.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total documents
    const totalResumes = await Resume.countDocuments();

    // Always return 200 with a normalized payload so the frontend can render an empty state
    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.resumesFetched, {
      totalResumes,
      currentPage: page,
      totalPages: totalResumes > 0 ? Math.ceil(totalResumes / limit) : 0,
      limit,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidIdFormat
      );
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.resumeNotFound
      );
    }

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.resumeFetched,
      resume
    );
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidIdFormat
      );
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.resumeNotFound
      );
    }

    // Delete file from cloud storage
    // Extract the key from the URL (everything after the last slash)
    const urlParts = resume["resume-link"].split('/');
    const key = urlParts[urlParts.length - 1];
    
    const params = {
      Bucket: process.env.HETZNER_BUCKET,
      Key: `resumes/${key}`,
    };
    
    try {
      await s3.deleteObject(params).promise();
    } catch (s3Error) {
      console.error('Error deleting file from cloud storage:', s3Error);
    }

    // Delete from database
    await Resume.findByIdAndDelete(id);

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.resumeDeleted
    );
  } catch (error) {
    next(error);
  }
};

export const updateResumeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidIdFormat
      );
    }

    // Validate status
    const validStatuses = ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!status || !validStatuses.includes(status)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        "Invalid status. Must be one of: " + validStatuses.join(', ')
      );
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.resumeNotFound
      );
    }

    // Update the status
    resume.status = status;
    await resume.save();

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      "Resume status updated successfully",
      resume
    );
  } catch (error) {
    next(error);
  }
};

export const getResumeDownloadUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(
        res,
        HttpStatusCodes.BAD_REQUEST,
        rejectResponseMessage.invalidIdFormat
      );
    }

    const resume = await Resume.findById(id);
    if (!resume || !resume["resume-link"]) {
      return handleResponse(
        res,
        HttpStatusCodes.NOT_FOUND,
        rejectResponseMessage.resumeNotFound
      );
    }

    // Derive object key from stored URL
    const urlParts = resume["resume-link"].split("/");
    const lastSegment = urlParts[urlParts.length - 1];
    const key = `resumes/${lastSegment}`;

    const params = {
      Bucket: process.env.HETZNER_BUCKET,
      Key: key,
      Expires: 60, // URL valid for 60 seconds
    };

    const signedUrl = s3.getSignedUrl("getObject", params);

    return handleResponse(
      res,
      HttpStatusCodes.OK,
      successResponseMessage.resumeFetched,
      { url: signedUrl }
    );
  } catch (error) {
    next(error);
  }
};