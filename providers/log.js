const errorHandler = require("../middlewares/errorHandler");
const Deposit = require("../models/Deposit");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const CustomError = require("../Utils/CustomError");

const transaction = async (transactionId, accountId, status, amount, type) => {
  try {
    await Transaction.create({
      transactionId,
      accountId,
      status,
      amount,
      type
    });
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
    return newDeposit.id;
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
    return newWithdrawal.id;
  } catch (error) {
    error = new CustomError(error.message, 500);
    errorHandler(error);
  }
};

module.exports = { transaction, deposit, withdrawal };
