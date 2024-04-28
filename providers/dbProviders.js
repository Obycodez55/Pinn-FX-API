const AccountDetails = require("../models/Account_details");

async function findByEmail(model, email) {
  try {
    const value = await model.findOne({ email: email });
    return value;
  } catch (error) {
    throw new Error({ error: error.message });
  }
}

async function createDetails(id){
    try {
      const details = await AccountDetails.create({accountId: id});
      return details._id;
    } catch (error) {
      throw new Error({ error: error.message });
    }
}

module.exports = { findByEmail, createDetails };
