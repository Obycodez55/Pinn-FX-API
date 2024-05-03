const Account = require("../models/Account.js");
const Reset_Code = require("../models/Reset_Code.js");
const crypto = require("crypto");
const getToken = require("../providers/GetToken.js");
const stripAccount = require("../helpers/stripDoc.js");
const findByCredentials = require("../providers/findByCredentials.js");
const {
  findAccountByEmail,
  createDetails,
  createLinkedAccount
} = require("../providers/dbProviders.js");
const CustomError = require("../Utils/CustomError.js");
const sendEmail = require("../Utils/email.js");

async function createAccount(req, res, next) {
  try {
    const newData = req.body || req.query;
    const account = new Account(newData);
    const token = getToken(account.email);
    const detailId = await createDetails(account.id);
    const linkedAccountId = await createLinkedAccount(account.id);
    account.token = token;
    account.details = detailId;
    account.linkedAccounts.push(linkedAccountId);
    const newaccount = await account.save();
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
      const err = new CustomError("Login failed! Check your credentials", 401);
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
  async function updateAccount() {
    try {
      await Account.findByIdAndUpdate(req.account.id, update);
      const account = await Account.findById(req.account.id);1
      stripAccount(account);
      return res.status(200).send({ statusCode: 200, account });
    } catch (error) {
      next(error);
    }
  }
  if (update.password) {
    const err = new CustomError(
      "Forbidden request: Can't update Password",
      403
    );
    next(err);
  } else if (update.email) {
    const token = getToken(update.email);
    update.token = token;
    updateAccount();
  } else {
    updateAccount();
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
    const reset = new Reset_Code({ token: resetToken });

    newreset = await reset.save();
    req.resetCode = reset.resetCode;
    // const message = `Reset Code ${reset.resetCode}`;
    try {
      await sendEmail.sendPasswordResetEmail({
        email: email,
        subject: "Password reset request received",
        message: reset.resetCode
      });
      res.status(200).send({
        status: "success",
        message: "Password reset link sent to the email address"
      });
    } catch (error) {
      account.passwordResetToken = undefined;
      account.passwordResetTokenExpires = undefined;
      account.save();
      next(error);
    }
  } catch (error) {
    if (error.code == 11000) {
      await Reset_Code.deleteOne({ resetCode: req.resetCode });
      forgotPassword(req, res, next);
    }
    next(error);
  }
}

async function verifyCode(req, res, next) {
  try {
    const code = req.body.code;
    const reset = await Reset_Code.findOne({ resetCode: code });
    if (!reset) {
      const error = new CustomError("Code is Invalid or expired", 400);
      next(error);
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
    next(error);
  }
}
async function resetPassword(req, res, next) {
  console.log(req.params.token);
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const account = await Account.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() }
    });
    console.log(account);
    if (!account) {
      const error = new CustomError("Code is Invalid or expired", 400);
      next(error);
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
    next(error);
  }
}

const test = (req, res) => {
  console.log(req.body);
};
module.exports = {
  createAccount,
  authenticate,
  update,
  forgotPassword,
  resetPassword,
  verifyCode,
  test
};
