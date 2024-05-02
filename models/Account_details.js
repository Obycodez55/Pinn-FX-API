const { Double, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AccountDetailsSchema = new Schema({
    accountId:{
        type: mongoose.Types.ObjectId,// get: v => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
        ref: "Account"
    },
    balance: {
        type: Number,
        default: 0
      },
      interest: {
        type: Number,
        default: 0
      },
      asset: {
        type: Number,
        default: 0
      },

});

module.exports = mongoose.model("Account_details", AccountDetailsSchema);