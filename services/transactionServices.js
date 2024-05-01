const Account = require("../models/Account");
const AccountDetails = require("../models/Account_details");
const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");
const ResetCode = require("../models/Reset_Code");

const {
    findAccountByEmail,
    getDetails
  } = require("../providers/dbProviders.js");

const CustomError = require("../Utils/CustomError.js");

async function test(req, res, next) {
    await Account.deleteMany();
    await AccountDetails.deleteMany();
    await ResetCode.deleteMany();
    return res.send("Done");
};

async function deposit(req, res, next) {
    const body = req.body;
    const details = await getDetails(req.account.id);
    details.asset += 78.34;
    await details.save();
    return res.send(details);
};


module.exports = { test, deposit };