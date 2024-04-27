const Account = require("../models/Account");

async function findByEmail(model, email) {
  try {
    const value = await model.findOne({ email: email });
    return value;
  } catch (error) {
    throw new Error({ error: error.message });
  }
}

module.exports = { findByEmail };
