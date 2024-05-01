const AccountDetails = require("../models/Account_details");
const Account = require("../models/Account");

const crypto = require("crypto");
const CustomError = require("../Utils/CustomError");

async function findAccountByEmail(email) {
  try {
    const account = await Account.findOne({ email: email });
    if (!account) {
     throw new CustomError("Account not found", 404);
    }
    return account;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

async function createDetails(id) {
  try {
    const details = await AccountDetails.create({ accountId: id});
    return details._id;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

async function getDetails(id){
  try {
    const details = await AccountDetails.findOne({ accountId: id });
    return details;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

module.exports = {
  findAccountByEmail,
  createDetails,
  getDetails
};
