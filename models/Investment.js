const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const InvestmentSchema = new Schema({
    accountId: mongoose.Types.ObjectId,
    status: {
      type: String,
      enum: ["success", "failure", "pending"] // Specify possible values
    },
    amount: Number,
    dateTime: {
      type: Date,
      default: Date.now()
    },
    duration: {
      type: mongoose.Types.ObjectId,
      ref: "LinkedAccount"
    },
    interest: Number 

});

module.exports = mongoose.model("Investment", InvestmentSchema);