import Joi from "joi";
import { passwordRegex } from "../constants/regex.constants.js";

export const adminRegistrationValidation = Joi.object({
  user_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special symbol.",
      "string.empty": "Password is required."
    })
})


//admin credentials reset function req.body validation
export const resetCredentialsValidation = Joi.object({
  user_name: Joi.string().min(3).max(50).required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must be at least 8 characters long, with uppercase, lowercase, number and special symbol."
    })
});

//admin login validation
export const adminLoginValidation = Joi.object({
  identifier: Joi.string().required().messages({
    "any.required": "Email or username is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  })
});