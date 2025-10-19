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
  missingFeilds: "Required fields are missing.",
  departmentAlreadyExist: "Department with this name already exists.",

  //user controller
  userAlreadyExist: 'User already exist',
  userCreated: "User created successfully",
  noUserFound: 'No user found',
  userNotFound: "User not found",
  invalidCredentials: 'invalid creadentials',
  invalidRoles: "One or more interest roles are invalid or deleted",
  allFeildsRequired: "All fields are required",
  passwordDoesNotMatch: "Passwords do not match",

  //admin
  userNameAlreadyExist: 'Username already exist',
  emailAlreadyExist: 'email already exist',
  roleNameRequired: 'Role name is required',
  roleAlreadyExist: 'Role already exists',
  noRolesFound: 'No role found',
  departmentNotFound: "Department not found.",
  dataNotFound: 'Data not found',
}

export const successResponseMessage = {
  //user controlle
  userCreated: "User created successfully",
  userfetched: "Users fetched successfully",
  loginSuccess: 'login successfull',
  profileUpdated: 'Profile updated successfully',
  updated: "Updated successfully.",
  deleted: 'data delated',

  //admin
  adminCreated: 'Admin created',
  instrestRoleCreated: 'Role created successfully',
  roleFetched: 'Role fetched',
  roleUpdated: 'Role updated',
  roleDeleted: 'Role deleted',
  dataFetched: "Data fetched successfully."
  
}