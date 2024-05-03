const Account = require("../models/Account");
const {getDetails} = require("./dbProviders")


const log = require("./log");
const sendEmail = require("../Utils/email");

async function investmentReturn(investment) {
    try {
      const details = await getDetails(investment.accountId);
      details.interest += investment.interest;
      investment.remDuration -=1;
      await details.save();
      await investment.save();
      const returnId = await log.investmentReturn(
        investment.id,
        "success",
        investment.interest
      );
      await log.transaction(
        returnId,
        investment.accountId,
        "success",
        investment.interest,
        "Investment Return"
      );
      const account = await Account.findById(investment.accountId);
      await sendEmail.sendInvestReturnEmail({
        email: account.email,
        subject: "You have been paid your investment",
        message: `${investment.interest}`
      });
      console.log("Sucessfully sent interest");
      return investment.remDuration;
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = investmentReturn