const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const DepositSchema = new Schema({
  accountId:{
    type: mongoose.Types.ObjectId,
    ref: "Account"
},
  status: {
    type: String,
    enum: ["success", "failure", "pending"] // Specify possible values
  },
  amount: Number,
  dateTime: {
    type: Date,
    default: Date.now()
  },
  from:{
    type: mongoose.Types.ObjectId,
    ref: "LinkedAccount"
  }
});

module.exports = mongoose.model("Deposit", DepositSchema);