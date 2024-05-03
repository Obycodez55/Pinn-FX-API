const cron = require("node-cron");

const { getDetails } = require("../providers/dbProviders");
const investmentReturn = require("../providers/return-Investment");

const schedule = async (day, start, end, investment) => {
  // const task = cron.schedule(`0 7 ${day} ${start}-${end}  *`, () => {
  const task = cron.schedule(`*/40 * * 3 ${start - 1}-${end}  *`, async () => {
    
    const rem = await investmentReturn(investment);
    if (rem <= 0) { 
      task.stop();
      const details = await getDetails(investment.accountId);
      details.balance += investment.amount;
      details.asset -= investment.amount;
      await details.save();
    }
  });
};

module.exports = schedule;