const bcrypt = require("bcryptjs");
const Account = require("../models/Account");
const { findAccountByEmail } = require("./dbProviders");

module.exports = async (email, password) => {
  
try {
  const account = await findAccountByEmail(Account, email);
  if (!account) {
    throw new Error("Invalid Login Credentials" );
  }
  const isPasswordMatch = bcrypt.compare(password, account.password);
  if (!isPasswordMatch) {
  throw new Error("Invalid Login Credentials");
  }
  return account;
} catch (error) {
  throw new Error(error.message ); // TODO: handle the validation errors properly
}
};


