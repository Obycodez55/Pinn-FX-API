const Account = require("../models/Account");
const AccountDetails = require("../models/Account_details");
const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");
const LinkedAccount = require("../models/Linked_account.js");
const ResetCode = require("../models/Reset_Code");

const { depositMoney } = require("../providers/paymentProviders.js");

const {
  getDetails,
  createLinkedAccount
} = require("../providers/dbProviders.js");

const CustomError = require("../Utils/CustomError.js");

async function test(req, res, next) {
  await Account.deleteMany();
  await AccountDetails.deleteMany();
  await ResetCode.deleteMany();
  return res.send("Done");
}

async function deposit(req, res, next) {
  const { amount, linkedAccountId } = req.body;
  try {
    const linkedAccount = await LinkedAccount.findById(linkedAccountId);
    const error = await depositMoney(amount, linkedAccount, next);
    if (error) {
        return res.status(403).send(error.error);
    } else try{
      await linkedAccount.save();
      const details = await getDetails(req.account.id);
      details.balance += Number(amount);
      await details.save();
      const newDeposit = new Deposit({
        accountId: req.account.id,
        amount: amount,
        status: "success",
        from: linkedAccountId
      });
      await newDeposit.save();
      const newTransaction = new Transaction({
        transactionId: newDeposit.id,
        accountId: req.account.id,
        status: "success",
        amount: amount,
        type: "Deposit"
      });
      await newTransaction.save();
      return res.status(200).send(details);
    }catch(error){
        next(error);
    }
  } catch (error) {
    next(error);
  }
}

async function createLinked(req, res, next) {
  const linked = await createLinkedAccount(req.account.id);
  req.account.linkedAccounts.push(linked.id);
  await req.account.save();
  return res.status(201).send(linked);
}

async function getLinked(req, res, next) {
  const linkedAccounts = await LinkedAccount.find({
    accountId: req.account.id
  });
  return res.status(200).send(linkedAccounts);
}

module.exports = { test, deposit, createLinked, getLinked };
