const express = require("express");
const ensureAuth = require("../middlewares/ensureAuth.js");
const errorHandler = require("../middlewares/errorHandler.js");
const tryCatch = require("../Utils/tryCatch.js");

const {
  test,
  deposit,
  withdraw,
  createLinked,
  getLinked,
  invest,
  history,
  getTransaction,
  withdrawInterest,
  getDeposit,
  getWithdrawal,
  getInvestment
} = require("../services/transactionServices.js");

const router = express.Router();

router.use(errorHandler);

router.get("/clear", (req, res, next) => {
  tryCatch(test(req, res, next));
});

router.post("/transaction/deposit", ensureAuth, (req, res, next) => {
  tryCatch(deposit(req, res, next));
});

router.post("/transaction/withdraw", ensureAuth, (req, res, next) => {
  tryCatch(withdraw(req, res, next));
});

router.post("/transaction/invest", ensureAuth, (req, res, next) => {
  tryCatch(invest(req, res, next));
});

router.post("/transaction/withdrawInterest", ensureAuth, (req, res, next) => {
  tryCatch(withdrawInterest(req, res, next));
});

router.get("/transaction/history", ensureAuth, (req, res, next) => {
  tryCatch(history(req, res, next));
});
router.get("/transaction/:transactionId", ensureAuth, (req, res, next) => {
  tryCatch(getTransaction(req, res, next));
});

router.post("/linked/create", ensureAuth, (req, res, next) => {
  tryCatch(createLinked(req, res, next));
});

router.get("/linked/get", ensureAuth, (req, res, next) => {
  tryCatch(getLinked(req, res, next));
});

router.get("/get/deposits", ensureAuth, (req, res, next) => {
  tryCatch(getDeposit(req, res, next));
});

router.get("/get/withdrawals", ensureAuth, (req, res, next) => {
  tryCatch(getWithdrawal(req, res, next));
});

router.get("/get/investments", ensureAuth, (req, res, next) => {
  tryCatch(getInvestment(req, res, next));
});

module.exports = router;
