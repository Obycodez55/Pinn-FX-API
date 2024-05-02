const express = require("express");
const ensureAuth = require("../middlewares/ensureAuth.js");

const {
  createAccount,
  authenticate,
  update,
  forgotPassword,
  resetPassword,
  verifyCode,
  test
} = require("../services/authServices.js");
const errorHandler = require("../middlewares/errorHandler.js");
const tryCatch = require("../Utils/tryCatch.js");

const router = express.Router();

router.use(errorHandler);
router.get("/", function (req, res) {
  res.status(200).send("welcome!");
});

router.post("/auth/create", (req, res, next) => {
  tryCatch(createAccount(req, res, next));
});

router.post("/auth/authenticate", (req, res, next) => {
  authenticate(req, res, next);
});

router.put("/account/update", ensureAuth, (req, res, next) => {
  console.log(req.body);
  update(req, res, next);
});
router.post("/auth/forgotPassword", (req, res, next) => {
  forgotPassword(req, res, next);
});
router.post("/auth/verifyCode", (req, res, next) => {
  verifyCode(req, res, next);
});
router.patch("/auth/resetPassword/:token", (req, res, next) => {
  resetPassword(req, res, next);
});
router.get("/test", (req, res) => {
  tryCatch(test(req, res));
})
module.exports = router;
