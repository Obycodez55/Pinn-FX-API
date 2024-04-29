const errorHandler = require("../middlewares/errorHandler");
const AccountDetails = require("../models/Account_details");
const CustomError = require("../Utils/CustomError");


async function getAccountDetails(req, res){
    const account = req.account;
    const accountId = account.details;
    try {
        const accountDetails = await AccountDetails.findById(accountId);
        return res.send(accountDetails);
    } catch (error) {
        error = new CustomError("Internal Server Error", 500)
        return errorHandler(error, req, res);
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
        error = new CustomError("Internal Server Error", 500)
        return errorHandler(error, req, res);
    } 
}
module.exports = { getAccountDetails, addToBalance }