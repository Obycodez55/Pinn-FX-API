const mongoose = require("mongoose");
const generate = require("../helpers/getResetCode");

const Schema = mongoose.Schema;
const Reset_CodeSchema = new Schema({
  resetCode: {
    type: String,
    default: generate()
  },
  token: String,
  Resetcode:{
    type: String,
    default: this.resetCode
  }
});

module.exports = mongoose.model("Reset_Code", Reset_CodeSchema);
