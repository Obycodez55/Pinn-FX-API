const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const WithdrawalSchema = new Schema({
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
  to: {
    type: mongoose.Types.ObjectId,
    ref: "LinkedAccount"
  }
});

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);
