const bcrypt = require("bcryptjs");
const Account = require("../models/Account");
const { findByEmail } = require("../providers/dbQuery");

module.exports = async (email, password) => {
  
try {
  const account = await findByEmail(Account, email);
  if (!account) {
    throw new Error({ error: "Invalid Login Credentials" });
  }
  const isPasswordMatch = bcrypt.compare(password, account.password);
  if (!isPasswordMatch) {
  throw new Error({ error: "Invalid Login Credentials" });
  }
  return account;
} catch (error) {
  throw new Error({ error: error.message }); // TODO: handle the validation errors properly
}
};


