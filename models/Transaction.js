const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  transactionId: mongoose.Types.ObjectId,
  accountId:{
    type: mongoose.Types.ObjectId,
    ref: "Account"
},
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Investment", "Investment Return"]
  },
  status: {
    type: String,
    enum: ["success", "failure", "pending"] // Specify possible values
  },
  amount: Number,
  dateTime: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
