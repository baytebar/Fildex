import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { HttpStatusCodes } from "../constants/statusCode.constants.js";
import { handleResponse } from "../utils/responseHandler.utils.js";
import { rejectResponseMessage, successResponseMessage } from "../constants/response.constants.js";

export const userRegistration = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (!name || !email || !password || !confirm_password) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.allFeildsRequired);
    }

    if (password !== confirm_password) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.passwordDoesNotMatch);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleResponse(res, HttpStatusCodes.CONFLICT, rejectResponseMessage.emailAlreadyExist);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const resData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    };

    return handleResponse(res, HttpStatusCodes.CREATED, successResponseMessage.userCreated, resData);

  } catch (error) {
    next(error);
  }
};


export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email|| !password) {
      return handleResponse(res, HttpStatusCodes.BAD_REQUEST, rejectResponseMessage.allFeildsRequired);
    }

    const user = await User.findOne({email });

    if (!user) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.invalidCredentials);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleResponse(res, HttpStatusCodes.UNAUTHORIZED, rejectResponseMessage.invalidCredentials);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email , role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const resData = {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    };

    return handleResponse(res, HttpStatusCodes.OK, successResponseMessage.loginSuccess, resData);

  } catch (error) {
    next(error);
  }
};