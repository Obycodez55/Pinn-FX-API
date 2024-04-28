const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AccountDetailsSchema = new Schema({
    accountId:{
        type: mongoose.Types.ObjectId,
        get: v => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
        ref: "Account",
        $toDecimal: true
    },
    balance: {
        type: mongoose.Types.Decimal128,
        default: 0.0
      },
      interest: {
        type: mongoose.Types.Decimal128,
        default: 0.0
      },
      asset: {
        type: mongoose.Types.Decimal128,
        default: 0.0
      },

});

module.exports = mongoose.model("Account_details", AccountDetailsSchema);