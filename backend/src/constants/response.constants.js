export const rejectResponseMessage = {
  serverError: "Server Error",
  idRequired: 'ID is required',
  invalidIdFormat: "Invalid user ID format",
  unauthorized: "Unauthorized user",
  tokenExpired: "Token expired",
  invalidToken: "Invalid token",
  invalidTokenOrUserNotFound: "Invalid token or account not found",
  accessDenied: "Access denied",
  invalidId: 'Invalid ID provided.',
  missingFields: "Required fields are missing.",
  departmentAlreadyExist: "Department with this name already exists.",

  //user controller
  userAlreadyExist: 'User already exist',
  userCreated: "User created successfully",
  noUserFound: 'No user found',
  userNotFound: "User not found",
  invalidCredentials: 'invalid creadentials',
  invalidRoles: "One or more job titles are invalid or deleted",
  allFeildsRequired: "All fields are required",
  passwordDoesNotMatch: "Passwords do not match",

  //admin
  userNameAlreadyExist: 'Username already exist',
  emailAlreadyExist: 'email already exist',
  roleNameRequired: 'Role name is required',
  roleAlreadyExist: 'Role already exists',
  noRolesFound: 'No role found',
  noJobTitlesFound: 'No job titles found',
  departmentNotFound: "Department not found.",
  dataNotFound: 'Data not found',
  
  // Job Posting
  MISSING_FIELDS: "Required fields are missing.",
  SERVER_ERROR: "Server Error",
  
  // Resume
  fileRequired: "Resume file is required",
  missingRequiredFields: "Name and email are required fields",
  invalidEmail: "Please provide a valid email address",
  invalidName: "Full name should contain only alphabetic characters and be between 2-50 characters long",
  invalidPhone: "Phone number should contain only numeric digits and be between 7-15 digits long",
  missingContactNumber: "Contact number is required",
  noResumesFound: "No resumes found",
  resumeNotFound: "Resume not found"
}

export const successResponseMessage = {
  //user controlle
  userCreated: "User created successfully",
  userfetched: "Users fetched successfully",
  loginSuccess: 'login successfull',
  profileUpdated: 'Profile updated successfully',
  updated: "Updated successfully.",
  deleted: 'data delated',
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",

  //admin
  adminCreated: 'Admin created',
  instrestRoleCreated: 'Role created successfully',
  jobTitleCreated: 'Job title created successfully',
  roleFetched: 'Role fetched',
  jobTitlesFetched: 'Job titles fetched successfully',
  jobTitleFetched: 'Job title fetched successfully',
  roleUpdated: 'Role updated',
  jobTitleUpdated: 'Job title updated successfully',
  roleDeleted: 'Role deleted',
  jobTitleDeleted: 'Job title deleted successfully',
  dataFetched: "Data fetched successfully.",
  
  // Resume
  resumeUploaded: "Resume uploaded successfully",
  resumesFetched: "Resumes fetched successfully",
  resumeFetched: "Resume fetched successfully",
  resumeDeleted: "Resume deleted successfully"
  
}
