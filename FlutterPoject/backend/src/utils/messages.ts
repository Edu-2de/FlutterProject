export const messages = {
  errors: {
    MISSING_CREDENTIALS: 'Required fields are missing. Please provide all necessary information.',
    NO_TOKEN_PROVIDED: 'Access denied. No authentication token was provided.',

    INVALID_EMAIL_FORMAT: 'The email format is invalid. Please provide a valid email address.',
    INVALID_PASSWORD_FORMAT:
      'The password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    INVALID_CREDENTIALS: 'The provided credentials are incorrect. Please check your email and password.',
    INVALID_ROLE: 'The provided role is incorrect. Please check the role types.',
    INVALID_USER_ID: 'Invalid user ID',
    INVALID_TOKEN: 'The provided token is invalid or expired. Please log in again.',

    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',

    UNAUTHORIZED_ACCESS: 'You do not have permission to access this resource.',

    USER_NOT_FOUND: 'The user was not found. They may not be registered or the provided ID may be incorrect.',
    USERS_NOT_FOUND: 'No users found, maybe the table is empty',

    PHONE_ALREADY_EXISTS: 'This phone is already registered. Please use a different phone.',
    EMAIL_ALREADY_EXISTS: 'This email is already registered. Please use a different email.',
  },
  success: {
    LOGIN_SUCCESS: 'You have successfully logged in.',
    USER_REGISTERED: 'The user has been successfully registered.',
    PROFILE_FETCHED: 'The user profile was successfully retrieved.',
    PROFILES_FETCHED: 'User profiles were successfully found',
    USER_UPDATED: 'User updated successfully',
  },
};
