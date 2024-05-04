const Account = require("../models/Account");
const AccountDetails = require("../models/Account_details");
const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit");
const LinkedAccount = require("../models/Linked_account.js");
const ResetCode = require("../models/Reset_Code");
const InvestmentReturn = require("../models/Investment_return.js");

const {
  depositMoney,
  withdrawMoney
} = require("../providers/paymentProviders.js");

const log = require("../providers/log.js");
const scheduleInvestmentReturn = require("../Utils/Scheduler.js");

const {
  getDetails,
  createLinkedAccount,
  getTransactionModel
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
    await InvestmentReturn.deleteMany();
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

// async function withdraw(req, res, next) {
//   const { amount, linkedAccountId } = req.body;
//   try {
//     const linkedAccount = await LinkedAccount.findById(linkedAccountId);
//     const error = await withdrawMoney(Number(amount), linkedAccount);
//     if (error) {
//       return res.status(403).send(error.error);
//     } else
//       try {
//         const details = await getDetails(req.account.id);
//         if (details.balance < Number(amount)) {
//           const error = new CustomError(
//             "Your balance is insufficient for this withdrawal",
//             403
//           );
//           next(error);
//         } else
//           try {
//             details.balance -= Number(amount);
//             await details.save();
//             await linkedAccount.save();
//             // console.log(details.balance);
//             const withdrawalId = await log.withdrawal(
//               req.account.id,
//               Number(amount),
//               "success",
//               linkedAccount.id
//             );
//             await log.transaction(
//               withdrawalId,
//               req.account.id,
//               "success",
//               Number(amount),
//               "Withdrawal"
//             );
//             return res.status(200).send(details);
//           } catch (error) {
//             next(error);
//           }
//       } catch (error) {
//         next(error);
//       }
//   } catch (error) {
//     next(error);
//   }
// }
async function withdraw(req, res, next) {
  const { amount, linkedAccountId } = req.body;
  try {
    const linkedAccount = await LinkedAccount.findById(linkedAccountId);
    const error = await withdrawMoney(Number(amount), linkedAccount);
    if (error) {
      return res.status(403).send(error.error);
    }
    const details = await getDetails(req.account.id);
    if (details.balance < Number(amount)) {
      const error = new CustomError(
        "Your balance is insufficient for this withdrawal",
        403
      );
      return next(error);
    }
    details.balance -= Number(amount);
    await details.save();
    await linkedAccount.save();
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
}

async function withdrawInterest(req, res, next){
  const details = await getDetails(req.account.id);
  details.balance += details.interest;
  details.interest = 0;
  await details.save();
  return res.status(200).send(details);
}

async function invest(req, res, next) {
  console.log(req.body)
  const { amount, duration } = req.body;
  try {
    const details = await getDetails(req.account.id);
    if (details.balance < Number(amount)) {
      const error = new CustomError(
        "Your balance is insufficient for this Investment",
        403
      );
      return next(error);
    }
    details.balance -= Number(amount);
    details.asset += Number(amount);
    await details.save();
    const investmentId = await log.investment(
      req.account.id,
      Number(amount),
      "success",
      Number(duration)
    );
    await log.transaction(
      investmentId,
      req.account.id,
      "success",
      Number(amount),
      "Investment"
    );
    const investment = await Investment.findById(investmentId);
    const id = investment.id;
    const day = investment.dateTime.getDate();
    const start = investment.dateTime.getMonth() + 2;
    const end = investment.endDate.getMonth();
    scheduleInvestmentReturn(day, start, end, investment);
    return res.status(200).send(details);
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  const transactions = await Transaction.find({
    accountId: req.account.id
  }).sort({ dateTime: 1 });
  return res.status(200).send(transactions);
}

async function getTransaction(req, res, next) {
  const { transactionId } = req.params;
  const transaction = await Transaction.findOne({ transactionId });
  const Model = getTransactionModel(transaction);
  transactionItem = await Model.findById(transactionId);
  return res.status(200).send(transactionItem);
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

module.exports = {
  test,
  deposit,
  withdraw,
  createLinked,
  getLinked,
  invest,
  history,
  getTransaction,
  withdrawInterest
};
