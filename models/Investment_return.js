const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const InvestmentReturnSchema = new Schema({
  investmentId: {
    type: mongoose.Types.ObjectId, // get: v => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
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
  }
});

module.exports = mongoose.model("InvestmentReturn", InvestmentReturnSchema);
