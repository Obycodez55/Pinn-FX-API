const errorHandler = require("../middlewares/errorHandler");
const Deposit = require("../models/Deposit");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const Investment = require("../models/Investment");
const InvestmentReturn = require("../models/Investment_return");
const CustomError = require("../Utils/CustomError");

const transaction = async (transactionId, accountId, status, amount, type) => {
  try {
    const newTrasaction = await Transaction.create({
      transactionId,
      accountId,
      status,
      amount,
      type
    });
    return newTrasaction;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};

const deposit = async (accountId, amount, status, from) => {
  try {
    const newDeposit = await Deposit.create({
      accountId,
      amount,
      status,
      from
    });
    return newDeposit;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};
const withdrawal = async (accountId, amount, status, to) => {
  try {
    const newWithdrawal = await Withdrawal.create({
      accountId,
      amount,
      status,
      to
    });
    return newWithdrawal;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};

const investment = async (accountId, amount, status, initDuration) => {
  try {
    const newInvestment = await Investment.create({
      accountId,
      amount,
      status,
      initDuration
    });
    return newInvestment;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};

const investmentReturn = async (investmentId, status, amount) => {
  try {
    const newReturn = await InvestmentReturn.create({
      investmentId,
      status,
      amount
    });
    return newReturn.id;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};

module.exports = { transaction, deposit, withdrawal, investment, investmentReturn };
