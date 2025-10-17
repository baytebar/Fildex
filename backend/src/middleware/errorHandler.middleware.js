import { rejectResponseMessage } from "../constants/response.constants.js";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";

export const errorHandling = (err, req, res, next) => {
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: rejectResponseMessage.serverError,
      error: err.message
    })

}