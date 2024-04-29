const validator = require("validator");
const CustomError = require("../Utils/CustomError");

function isEmail(value) {
  if (!validator.isEmail(value)) {
    throw new CustomError("Invalid Email Address", 400);
  }
}

function isValidDate(value) {
  if (
    !validator.isDate(value) ||
    typeof value != "number" ||
    typeof value != "object"
  ) {
    throw new CustomError("Invalid Date", 400);
  }

  // Subtract 18 years from now and see if greater than birth date
  var now = new Date();
  var m = now.getMonth();
  now.setFullYear(now.getFullYear() - 18);
  // deal with today being 29 Feb
  if (m != now.getMonth()) now.setDate(0);

  if (now > value) {
    throw new CustomError("User is less than 18", 400);
  }
}

function isValidPhone(value) {
    if (!validator.isMobilePhone(value)) {
      throw new CustomError("invalid phone number", 400);
    }
}

module.exports = { isEmail, isValidDate, isValidPhone };
