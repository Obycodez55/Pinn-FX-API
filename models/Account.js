const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Account = require("./Account");

const {
  isEmail,
  isValidDate,
  isValidPhone
} = require("../providers/dbValidator.js");
const hashPassword = require("../helpers/hashPassword.js");

const Schema = mongoose.Schema;
const AccountSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      validate: (value) => isEmail(value)
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      validate: (value) => isValidDate(value)
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      validate: (value) => isValidPhone(value)
    },
    balance: {
      type: mongoose.Types.Decimal128,
      default: 0.0
    },
    token: {
      type: String,
      required: true
    },
    linkedAccounts: {
      type: [mongoose.Types.ObjectId],
      ref: "Linked_account"
    },
    lastLogin: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next) {
  const account = this;
  if (account.isModified("password")) {
    try {
      account.password = await hashPassword(account.password);
    } catch (error) {
      console.log(error);
      throw new Error({ error: error.message });
    }
  }
  next();
});

// AccountSchema.methods.isCorrectedPassword = function (password, callback) {
//   bcrypt.compare(password, this.password, function (err, same) {
//     if (err) {
//       callback(err);
//     } else {
//       callback(err, same);
//     }
//   });
// };

module.exports = mongoose.model("Account", AccountSchema);
