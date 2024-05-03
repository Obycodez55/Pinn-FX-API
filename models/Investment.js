const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const InvestmentSchema = new Schema({
  accountId: {
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
  },
  initDuration: Number,
  remDuration: Number,
  interest: Number,
  totalInterest: Number,
  endDate: Date
});

InvestmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.remDuration = this.initDuration;
  this.interest = this.amount * 0.15;
  this.totalInterest = this.interest * this.initDuration;
  
  // Set the end date
  const initialDate = new Date(this.dateTime);
  const initialMonth = initialDate.getMonth();
  const newDate = new Date(initialDate);
  newDate.setMonth(initialMonth + this.initDuration);
  
  this.endDate = new Date(newDate);
  }
  
  next();
});

module.exports = mongoose.model("Investment", InvestmentSchema);
