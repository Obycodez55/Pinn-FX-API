const Account = require("../models/Account.js");
const getToken = require("../providers/GetToken.js");

const stripAccount = require("../helpers/stripDoc.js");
const findByCredentials = require("../providers/findByCredentials.js");
const { findByEmail, createDetails } = require("../providers/dbProviders.js");
const hashPassword = require("../helpers/hashPassword.js");
const errorHandler = require("../middlewares/errorHandler.js");

async function createAccount(res, req) {
  try {
    const newData = req.body || req.query;

    const account = new Account(newData);
    const token = getToken(account.email);
    const detailId = await createDetails(account.id);
    account.token = token;
    account.details = detailId;
    await account.save();
    stripAccount(account); // TODO: work on striping the data before sending it
    return res.status(201).send({ account });
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

async function authenticate(res, req) {
  const newData = req.body || req.query;
  try {
    const { email, password } = newData;
    const account = await findByCredentials(email, password);
    if (!account) {
      return res
        .status(403)
        .send({ error: "Login failed! Check your credentials" });
    }
    account.lastLogin = Date.now();
    await account.save();
    stripAccount(account);
    return res.status(200).send({ account });
  } catch (error) {
    return res.status(401).send(error.message);
  }
}

async function update(res, req) {
  const update = req.body || req.query;

  try {
    if (update.password) {
      update.password = await hashPassword(update.password);
    }
    await Account.findByIdAndUpdate(req.account.id, update);

    const account = await findByEmail(Account, req.account.email);
    // stripAccount(account);
    return res.status(200).send({ account });
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

module.exports = { createAccount, authenticate, update };
