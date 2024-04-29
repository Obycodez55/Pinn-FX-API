const Account = require("../models/Account.js");
const Reset_Code = require("../models/Reset_Code.js");
const crypto = require("crypto");
const getToken = require("../providers/GetToken.js");
const getErrorType = require("../helpers/getErrorType.js");
const stripAccount = require("../helpers/stripDoc.js");
const findByCredentials = require("../providers/findByCredentials.js");
const {
  findAccountByEmail,
  createDetails,
  generatePasswordResetToken
} = require("../providers/dbProviders.js");
const hashPassword = require("../helpers/hashPassword.js");
const errorHandler = require("../middlewares/errorHandler.js");
const CustomError = require("../Utils/CustomError.js");
const sendEmail = require("../Utils/email.js");

async function createAccount(req, res, next) {
  try {
    const newData = req.body || req.query;
    console.log({body: newData});
    const account = new Account(newData);
    console.log({newAccount: account});
    const token = getToken(account.email);
    const detailId = await createDetails(account.id);
    console.log({newAccount: account, token: token});
    account.token = token;
    account.details = detailId;
    console.log(account);
    const newaccount = await account.save();
    console.log({created: newaccount});
    stripAccount(account); // TODO: work on striping the data before sending it,,,,
    return res.status(201).send({ statusCode: 201, account });
  } catch (error) {
    next(error);
  }
}

async function authenticate(req, res, next) {
  const newData = req.body || req.query;
  try {
    const { email, password } = newData;
    const account = await findByCredentials(email, password);
    if (!account) {
      const err = new CustomError("Login failed! Check your credentials", 403);
      next(err);
    }
    account.lastLogin = Date.now();
    await account.save();
    stripAccount(account);
    return res.status(200).send({ statusCode: 200, account });
  } catch (error) {
    error = new CustomError(error.message, 401);
    next(error);
  }
}

async function update(req, res, next) {
  const update = req.body || req.query;

  try {
    await Account.findByIdAndUpdate(req.account.id, update);

    const account = await findAccountByEmail(Account, req.account.email);
    if (!account) {
      const err = new CustomError("Account not found", 400);
      next(err);
    }
    stripAccount(account);
    return res.status(200).send({ statusCode: 200, account });
  } catch (error) {
    error = new CustomError(error.message, error.code);
    next(error);
  }
}


async function forgotPassword(req, res, next) {
  try {
    const email = req.body.email || req.query.email || req.params.email;
    const account = await findAccountByEmail(email);
    if (!account) {
      const error = new CustomError(
        "Account with given email does not exist",
        404
      );
      next(error);
    }

    const resetToken = account.generatePasswordResetToken();
    await account.save();
    const reset = await Reset_Code.create({ token: resetToken });
    const message = `Reset Code ${reset.resetCode}`;
    try {
      await sendEmail({
        email: email,
        subject: "Password reset request received",
        message: message
      });
      res.status(200).send({
        status: "success",
        message: "Password reset link sent to the email address"
      });
    } catch (error) {
      if (error.code == 11000) {
        await Reset_Code.deleteMany({ resetCode: reset.code });
        forgotPassword(req, res);
      }
      account.passwordResetToken = undefined;
      account.passwordResetTokenExpires = undefined;
      account.save();
      error = new CustomError(
        "Password reset email not sent, Pls try again later",
        500
      );
      next(error);
    }
  } catch (error) {
    console.log(error);
    error = new CustomError(error.message, 500);
    return errorHandler(error, req, res);
  }
}

async function verifyCode(req, res, next) {
  try {
    const code = req.body.code;
    const reset = await Reset_Code.findOne({ resetCode: code });
    if (!reset) {
      const error = new CustomError("Code is Invalid or expired", 400);
      return errorHandler(error, req, res);
    }
    const resetToken = reset.token;
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/auth/resetPassword/${resetToken}`;
    return res.status(200).send({
      resetEndpoint: resetUrl,
      requestType: "patch",
      require: "password"
    });
  } catch (error) {
    error = new CustomError(error.message, 500);
    return errorHandler(error, req, res);
  }
}
async function resetPassword(req, res, next) {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const account = await Account.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() }
    });
    if (!account) {
      const error = new CustomError("Code is Invalid or expired", 400);
      return errorHandler(error, req, res);
    }
    account.password = req.body.password;
    account.passwordResetToken = undefined;
    account.passwordResetTokenExpires = undefined;
    account.passwordChangedAt = Date.now();
    account.token = getToken(account.email);
    account.lastLogin = Date.now();

    await account.save();

    return res.status(200).send(account);
  } catch (error) {
    error = new CustomError(error.message, 500);
    return errorHandler(error, req, res);
  }
}

const test = (req, res) => {
  console.log(req.body);
}
module.exports = {
  createAccount,
  authenticate,
  update,
  forgotPassword,
  resetPassword,
  verifyCode,
  test
};
