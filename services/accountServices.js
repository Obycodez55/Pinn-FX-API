const AccountDetails = require("../models/Account_details");


async function getAccountDetails(req, res){
    const account = req.account;
    const accountId = account.details;
    try {
        const accountDetails = await AccountDetails.findById(accountId);
        return res.send(accountDetails);
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }  
}

async function addToBalance(req, res) {
    const account = req.account;
    const accountId = account.details;
    try {
        const accountDetails = await AccountDetails.findById(accountId);
        accountDetails.balance = Number(accountDetails.balance) + Number(req.body.add);
        await AccountDetails.save();
        return res.send(accountDetails);
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    } 
}
module.exports = { getAccountDetails, addToBalance }