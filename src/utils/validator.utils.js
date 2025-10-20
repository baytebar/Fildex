import Joi from "joi";
import { countryCodeRegex } from "../constants/regex.constants.js";

export const userValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  contact: Joi.object({
    // number: Joi.string().pattern(/^[0-9]{7,15}$/).required(), // allows 7–15 digits
    number: Joi.number().required(),
    country_code: Joi.string().pattern(countryCodeRegex).required(), // +91, +1, +44
  }).required(),
});

// Validation schema (only contact)
export const updateProfileValidation = Joi.object({
  contact: Joi.object({
    number: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Contact number must be between 7 to 15 digits",
      }),
    country_code: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .required()
      .messages({
        "string.pattern.base": "Country code must start with + followed by 1–4 digits",
      }),
  }).required(),
  intrestRoles: Joi.array().items(Joi.string().hex().length(24)).required()
});

