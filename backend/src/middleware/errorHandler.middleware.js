import { rejectResponseMessage } from "../constants/response.constants.js";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";

export const errorHandling = (err, req, res, next) => {

  // Determine status code based on error type
  let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = rejectResponseMessage.serverError;

  if (err.name === 'ValidationError') {
    statusCode = HttpStatusCodes.BAD_REQUEST;
    message = 'Validation Error: ' + err.message;
  } else if (err.name === 'CastError') {
    statusCode = HttpStatusCodes.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = HttpStatusCodes.CONFLICT;
    message = 'Duplicate entry';
  } else if (err.name === 'MulterError') {
    statusCode = HttpStatusCodes.BAD_REQUEST;
    message = 'File upload error: ' + err.message;
  }

  res.status(statusCode).json({
    status: statusCode,
    message: message,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}