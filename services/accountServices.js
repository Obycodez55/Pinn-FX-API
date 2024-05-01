const errorHandler = require("../middlewares/errorHandler");
const AccountDetails = require("../models/Account_details");
const { getDetails } = require("../providers/dbProviders");
const CustomError = require("../Utils/CustomError");

async function getAccountDetails(req, res) {
  const account = req.account;
  const accountDetails = await getDetails(account.id);
  return res.send({ ...account._doc, ...accountDetails._doc });
}

async function addToBalance(req, res, next) {
  try {
    const accountDetails = await getDetails(req.account.id);
    accountDetails[req.body.type] += Number(req.body.add);
    await accountDetails.save();
    return res.send(accountDetails);
  } catch (error) {
    next(error);
  }
}
module.exports = { getAccountDetails, addToBalance };
