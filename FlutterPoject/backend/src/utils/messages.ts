export const messages = {
  errors: {
    // Authentication & Authorization Errors
    MISSING_CREDENTIALS: 'Required fields are missing. Please provide all necessary information to proceed.',
    NO_TOKEN_PROVIDED: 'Access denied. Authentication token is required to access this resource.',
    INVALID_TOKEN: 'The authentication token is invalid or has expired. Please log in again to continue.',
    UNAUTHORIZED_ACCESS: 'Access denied. You do not have sufficient permissions to perform this action.',
    
    // Validation Errors
    INVALID_EMAIL_FORMAT: 'The email address format is invalid. Please enter a valid email address (e.g., user@example.com).',
    INVALID_PASSWORD_FORMAT: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    INVALID_CREDENTIALS: 'The email or password you entered is incorrect. Please verify your credentials and try again.',
    INVALID_ROLE: 'The specified role is not valid. Accepted roles are: admin, manager, or customer.',
    INVALID_USER_ID: 'The provided user ID is invalid or malformed. Please check the ID and try again.',
    VALIDATION_ERROR: 'The submitted data contains validation errors. Please review and correct the highlighted fields.',
    
    // User Management Errors
    USER_NOT_FOUND: 'The requested user could not be found. The user may not exist or may have been removed.',
    USERS_NOT_FOUND: 'No users were found in the system. The user database appears to be empty.',
    EMAIL_ALREADY_EXISTS: 'An account with this email address already exists. Please use a different email or try logging in.',
    PHONE_ALREADY_EXISTS: 'This phone number is already associated with another account. Please use a different phone number.',
    
    // Address Management Errors
    ADDRESS_NOT_FOUND: 'The requested address could not be found or does not belong to your account.',
    ADDRESSES_NOT_FOUND: 'No addresses were found for this user account.',
    INVALID_ADDRESS_DATA: 'The provided address information is incomplete or invalid. Please check all required fields.',
    ADDRESS_LIMIT_EXCEEDED: 'You have reached the maximum number of saved addresses. Please remove an existing address before adding a new one.',
    
    // Server & System Errors
    SERVER_ERROR: 'An unexpected server error occurred. Please try again later or contact support if the problem persists.',
    DATABASE_ERROR: 'A database error occurred while processing your request. Please try again later.',
    CONNECTION_ERROR: 'Unable to establish connection to the service. Please check your internet connection and try again.',
    
    // Resource Errors
    RESOURCE_NOT_FOUND: 'The requested resource could not be found or may have been moved.',
    OPERATION_FAILED: 'The requested operation could not be completed. Please try again or contact support.',
    
    // Rate Limiting & Security
    TOO_MANY_REQUESTS: 'Too many requests have been made from this IP address. Please wait before trying again.',
    ACCOUNT_LOCKED: 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.',
    
    // File & Upload Errors
    FILE_TOO_LARGE: 'The uploaded file is too large. Please select a file smaller than the allowed size limit.',
    INVALID_FILE_TYPE: 'The file type is not supported. Please upload a valid file format.',
  },
  
  success: {
    // Authentication Success
    LOGIN_SUCCESS: 'Welcome back! You have successfully logged in to your account.',
    LOGOUT_SUCCESS: 'You have been successfully logged out. Thank you for using our service.',
    
    // User Management Success
    USER_REGISTERED: 'Your account has been created successfully! Welcome to our platform.',
    PROFILE_FETCHED: 'User profile information has been successfully retrieved.',
    PROFILES_FETCHED: 'User profiles have been successfully loaded from the database.',
    USER_UPDATED: 'Your profile has been updated successfully. All changes have been saved.',
    USER_DELETED: 'The user account has been permanently deleted from the system.',
    PASSWORD_UPDATED: 'Your password has been updated successfully. Please use your new password for future logins.',
    
    // Address Management Success
    ADDRESS_ADDED: 'The new address has been successfully added to your account.',
    ADDRESS_UPDATED: 'Your address information has been updated successfully.',
    ADDRESS_DELETED: 'The selected address has been removed from your account.',
    DEFAULT_ADDRESS_SET: 'The selected address has been set as your default address.',
    
    // General Operations Success
    OPERATION_COMPLETED: 'The requested operation has been completed successfully.',
    DATA_SAVED: 'Your information has been saved successfully.',
    CHANGES_APPLIED: 'All changes have been applied and saved to your account.',
    
    // Email & Notifications
    EMAIL_SENT: 'Email has been sent successfully. Please check your inbox.',
    NOTIFICATION_SENT: 'Notification has been sent successfully.',
    
    // Admin Operations
    ADMIN_ACTION_COMPLETED: 'The administrative action has been completed successfully.',
    USER_STATUS_UPDATED: 'The user status has been updated successfully.',
    PERMISSIONS_UPDATED: 'User permissions have been updated successfully.',
  },
};