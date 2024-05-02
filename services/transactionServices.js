const Account = require("../models/Account");
const AccountDetails = require("../models/Account_details");
const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");
const LinkedAccount = require("../models/Linked_account.js");
const ResetCode = require("../models/Reset_Code");

const {
  depositMoney,
  withdrawMoney
} = require("../providers/paymentProviders.js");

const log = require("../providers/log.js");

const {
  getDetails,
  createLinkedAccount
} = require("../providers/dbProviders.js");

const CustomError = require("../Utils/CustomError.js");

async function test(req, res, next) {
  try {
    await Account.deleteMany();
    await AccountDetails.deleteMany();
    await ResetCode.deleteMany();
    await Transaction.deleteMany();
    await Withdrawal.deleteMany();
    await Deposit.deleteMany();
    await LinkedAccount.deleteMany();
    await Investment.deleteMany();
    return res.send("Done");
  } catch (error) {
    next(error);
  }
}

async function deposit(req, res, next) {
  const { amount, linkedAccountId } = req.body;
  try {
    const linkedAccount = await LinkedAccount.findById(linkedAccountId);
    const error = await depositMoney(Number(amount), linkedAccount, next);
    if (error) {
      return res.status(403).send(error.error);
    } else
      try {
        await linkedAccount.save();
        const details = await getDetails(req.account.id);
        details.balance += Number(amount);
        await details.save();
        const depositId = await log.deposit(
          req.account.id,
          Number(amount),
          "success",
          LinkedAccount.id
        );
        await log.transaction(
          depositId,
          req.account.id,
          "success",
          Number(amount),
          "Deposit"
        );
        return res.status(200).send(details);
      } catch (error) {
        next(error);
      }
  } catch (error) {
    next(error);
  }
}

async function withdraw(req, res, next) {
  const { amount, linkedAccountId } = req.body;
  try {
    const linkedAccount = await LinkedAccount.findById(linkedAccountId);
    const error = await withdrawMoney(Number(amount), linkedAccount);
    if (error) {
      return res.status(403).send(error.error);
    } else
      try {
        const details = await getDetails(req.account.id);
        if (details.balance < Number(amount)) {
          const error = new CustomError(
            "Your balance is insufficient for this withdrawal",
            403
          );
          next(error);
        } else
          try {
            details.balance -= Number(amount);
            await details.save();
            await linkedAccount.save();
            // console.log(details.balance);
            const withdrawalId = await log.withdrawal(
              req.account.id,
              Number(amount),
              "success",
              linkedAccount.id
            );
            await log.transaction(
              withdrawalId,
              req.account.id,
              "success",
              Number(amount),
              "Withdrawal"
            );
            return res.status(200).send(details);
          } catch (error) {
            next(error);
          }
      } catch (error) {
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

module.exports = { test, deposit, withdraw, createLinked, getLinked };
