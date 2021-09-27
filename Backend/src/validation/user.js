const Validator = require("validator");
const validText = require("./valid-text");
const moment = require("moment");

// Changing passwords is not supported yet.
const allowedFieldsForUpdate = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "profilePicture",
  "identificationImg",
  "phoneNumber",
  "address",
  "paypalEmail",
];

const validateUpdateRequest = (req) => {
  if (Object.keys(req.body).length === 0 || Object.keys(req.body).length > 1) {
    return {
      error: "Bad Request",
      message:
        Object.keys(req.body).length > 1
          ? "One field can be updated at a time"
          : "The request body is empty",
    };
  }

  let key = Object.keys(req.body)[0];
  let value = req.body[key];

  if (allowedFieldsForUpdate.indexOf(key) === -1) {
    return {
      error: "Bad Request",
      message: "Not a valid field for update",
    };
  }

  switch (key) {
    case "firstName":
      if (!Validator.isLength(value, { min: 2, max: 30 })) {
        return {
          error: "Bad Request",
          message: "firstName must be between 2 and 30 characters",
        };
      }
      break;
    case "lastName":
      if (!Validator.isLength(value, { min: 2, max: 30 })) {
        return {
          error: "Bad Request",
          message: "lastName must be between 2 and 30 characters",
        };
      }
      break;
    case "dateOfBirth":
      if (!moment(value).isValid()) {
        return {
          error: "Bad Request",
          message: "Enter a valid date",
        };
      }
      break;
    case "profilePicture":
      // TODO
      return {
        error: "Not Implemented",
        message: "Not Implemented",
      };
      break;
    case "identificationImg":
      // TODO
      return {
        error: "Not Implemented",
        message: "Not Implemented",
      };
      break;
    case "phoneNumber":
      if (value.match(/\d/g).length !== 10) {
        return {
          error: "Bad Request",
          message: "Phone number must consist of 10 digits",
        };
      }
      break;
    case "address":
      if (Validator.isEmpty(value)) {
        return {
          error: "Bad Request",
          message: "Address can not be empty",
        };
      }
      break;
  }

  // No violations found so far.
  return null;
};

module.exports = {
  validateUpdateRequest,
};
