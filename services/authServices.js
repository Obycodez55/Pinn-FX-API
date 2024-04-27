const Account = require("../models/Account.js");
const getToken = require("../providers/GetToken.js");

const stripAccount = require("../helpers/stripDoc.js");
const findByCredentials = require("../providers/findByCredentials.js");
const getErrorType = require("../helpers/getErrorType.js");
const getReqData = require("../helpers/getReqData.js");
const { findByEmail } = require("../providers/dbQuery.js");
const hashPassword = require("../helpers/hashPassword.js");

async function createAccount(res, req) {
  try {
    const newData = req.body || req.query;

    const account = new Account(newData);
    const token = getToken(account.email);
    account.token = token;
    await account.save();
    stripAccount(account); // TODO: work on striping the data before sending it
    return res.status(201).send({ account });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .send({
          error: `Duplicate account! ${getErrorType(error)} already exists`
        });
    }
    return res.status(500).send({ error });
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
    return res.status(400).send({ error });
  }
}

async function update(res, req) {
  const update = req.body || req.query;

  try {
    if(update.password){
      update.password = await hashPassword(update.password);
    }
    await Account.findByIdAndUpdate(req.account.id, update);
    const account = await findByEmail(Account, req.account.email);
    stripAccount(account);
    return res.status(200).send({ account });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .send({
          error: `Duplicate account! ${getErrorType(error)} already exists`
        });
    }
    else{
      return res.status(500).send({ error });
    }
    
  }
}

module.exports = { createAccount, authenticate, update };
