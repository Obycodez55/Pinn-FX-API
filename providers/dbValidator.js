const validator = require("validator");

function isEmail(value) {
  if (!validator.isEmail(value)) {
    throw new Error({ error: "Invalid Email Address" });
  }
}

function isValidDate(value) {
  if (
    !validator.isDate(value) ||
    typeof value != "number" ||
    typeof value != "object"
  ) {
    throw new Error({ error: "Invalid Date" });
  }

  // Subtract 18 years from now and see if greater than birth date
  var now = new Date();
  var m = now.getMonth();
  now.setFullYear(now.getFullYear() - 18);
  // deal with today being 29 Feb
  if (m != now.getMonth()) now.setDate(0);

  if (now > value) {
    throw new Error({error: "User is less than 18"});
  }
}

function isValidPhone(value) {
    if (!validator.isMobilePhone(value)) {
        throw new Error({error: "invalid phone number"});
    }
}

module.exports = { isEmail, isValidDate, isValidPhone };
