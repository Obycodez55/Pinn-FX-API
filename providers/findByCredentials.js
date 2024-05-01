const bcrypt = require("bcryptjs");
const { findAccountByEmail } = require("./dbProviders");

module.exports = async (email, password) => {
  
try {
  const account = await findAccountByEmail(email);
  if (!account) {
    throw new Error("Invalid Login Credentials" );
  }
  const isPasswordMatch = await bcrypt.compare(password, account.password);
  if (!isPasswordMatch) {
  throw new Error("Invalid Login Credentials");
  }
  return account;
} catch (error) {
  throw new Error(error.message ); // TODO: handle the validation errors properly
}
};


