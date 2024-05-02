const AccountDetails = require("../models/Account_details");
const Account = require("../models/Account");
const LinkedAccount = require("../models/Linked_account");
const Banks = require("../Utils/Banks");

const CustomError = require("../Utils/CustomError");

async function findAccountByEmail(email) {
  try {
    const account = await Account.findOne({ email: email });
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
    return account;
  } catch (error) {
    const code = error.statusCode || 500;
    throw new CustomError(error.message, code);
  }
}

async function createLinkedAccount(accountId) {
  const random = Math.floor(Math.random() * Banks.length);
  const bank = Banks[random];
  const balance = (Math.round(((random * 10000) / Math.floor(Math.random() * 10)) * 100)) / 100;
  try {
    const linkedAccount = await LinkedAccount.create({ accountId, balance, bank });
    return linkedAccount._id;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

async function createDetails(id) {
  try {
    const details = await AccountDetails.create({ accountId: id });
    return details._id;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

async function getDetails(id) {
  try {
    const details = await AccountDetails.findOne({ accountId: id });
    if (!details) {
      throw new CustomError("This user has no account with us", 404);
    }
    return details;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
}

module.exports = {
  findAccountByEmail,
  createDetails,
  getDetails,
  createLinkedAccount
};
