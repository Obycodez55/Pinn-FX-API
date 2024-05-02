const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const LinkedAccountSchema = new Schema({
    accountId:{
        type: mongoose.Types.ObjectId,
        ref: "Account"
    },
    bank: String,
    balance: Number,
    blocked: {type: Boolean, default: false}
});

module.exports = mongoose.model("Linked_account", LinkedAccountSchema);