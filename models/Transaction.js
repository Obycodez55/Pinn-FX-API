const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  transactionId: mongoose.Types.ObjectId,
  accountId: mongoose.Types.ObjectId,
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Investment"]
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
