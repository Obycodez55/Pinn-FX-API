const mongoose = require("mongoose");
const generate = require("../helpers/getResetCode");

const Schema = mongoose.Schema;
const Reset_CodeSchema = new Schema({
  resetCode: String,
  token: String
});

Reset_CodeSchema.pre('save', function(next){
  const newcode = generate();
  this.resetCode = newcode;
  next();
});

module.exports = mongoose.model("Reset_Code", Reset_CodeSchema);
