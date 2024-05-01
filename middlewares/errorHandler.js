const getErrorType = require("../helpers/getErrorType");
const CustomError = require("../Utils/CustomError");
const errorHandler = (error, req, res, next) => {
  // console.log(error);
  if (error.code === 11000) {
    error = new CustomError(
      `Duplicate account! ${getErrorType(error)} already exists`,
      409
    );
  }else
  if (error._message == "Account validation failed") {
    error = new CustomError(error.message, 400);
  }
  error.statusCode = error.statusCode || 500;
  return res.status(error.statusCode).send({
    status: error.statusCode,
    message: error.message,
    error: error
  });
};
 
module.exports = errorHandler;
