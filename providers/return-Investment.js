const Account = require("../models/Account");
const {getDetails} = require("./dbProviders")

const months = ["January", "February"," March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
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
        subject: "Notification of Investment Return Payment",
        info: {
          customer: account.firstName + " " + account.lastName,
          amount: investment.interest,
          date: new Date(),
          asset: investment.amount,
          month: months[investment.dateTime.getMonth() + investment.initDuration - investment.remDuration]
        }
      });
      console.log("Sucessfully sent interest");
      return investment.remDuration;
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = investmentReturn