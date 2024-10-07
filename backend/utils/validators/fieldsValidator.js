// Description: This file contains the fields validation functions.

// Function to validate user fields
exports.validateUserFields = (fields) => {
  const errors = {};

  if (!fields.firstName) {
    errors.firstName = "First name is required";
  } else if (!/^[A-Za-z\s]+$/.test(fields.firstName)) {
    errors.firstName = "First name must contain only letters and spaces";
  }

  if (!fields.lastName) {
    errors.lastName = "Last name is required";
  } else if (!/^[A-Za-z\s]+$/.test(fields.lastName)) {
    errors.lastName = "Last name must contain only letters and spaces";
  }

  if (!fields.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Invalid email format";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(fields.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(fields.password)) {
    errors.password = "Password must contain at least one number";
  }

  if (fields.role && !isValidRole(fields.role)) {
    errors.role = "Invalid role";
  }

  return errors;
};

// Function to validate role fields
function isValidRole(role) {
  const validRoles = ["admin", "user", "author"];
  return validRoles.includes(role);
}

// Function to validate role fields
exports.validateRoleFields = (fields) => {
  const errors = {};

  if (!fields.name) {
    errors.name = "Role name is required";
  } else if (
    fields?.name !== "admin" &&
    fields?.name !== "user" &&
    fields?.name !== "author"
  ) {
    errors.name = "Invalid role name";
  }

  return errors;
};

// Function to validate login fields
exports.validateLoginFields = (fields) => {
  const errors = {};

  if (!fields.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Invalid email format";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Function to validate content fields
exports.validateContentFields = (fields) => {
  const errors = {};

  if (!fields.title) {
    errors.title = "Title is required";
  }

  if (!fields.description) {
    errors.description = "Description is required";
  }

  if (!fields.body) {
    errors.body = "Body is required";
  }

  if (!fields.author) {
    errors.author = "Author is required";
  }

  if (!fields.amount) {
    errors.amount = "Amount is required";
  }

  if (!fields.type) {
    errors.type = "Type is required";
  }

  return errors;
};

// Function to validate permission fields
exports.validatePermissionFields = (fields) => {
  const errors = {};

  if (!fields.name) {
    errors.name = "Name is required";
  }

  if(!fields.content){
    errors.content="Content is required";
  }

  return errors;
};

exports.validatePaymentFields = (fields) => {
  const errors = {};

  if (!fields.amount) {
    errors.amount = "Amount is required";
  } 
  
  if (isNaN(fields.amount)) {
    errors.amount = "Amount must be a number";
  }

  if (!fields.cardNumber) {
    errors.cardNumber = "Card number is required";
  }

  if (!fields.expiryDate) {
    errors.expiryDate = "Expiry date is required";
  }

  if (!fields.cvv) {
    errors.cvv = "CVV is required";
  }

  if(!fields.name)
  {
    errors.name="Name is required";
  }

  return errors;
}