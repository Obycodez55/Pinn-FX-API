const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { isEmail, isValidDate, isValidPhone } = "../providers/dbValidator.js";

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
      validate: isEmail(value)
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      validate: isValidDate(value)
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: isValidPhone(value)
    },
    balance: {
      type: mongoose.Types.Decimal128,
      default: 0.0
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    linkedAccounts: {
        type: [mongoose.Types.ObjectId],
        ref: "Linked_account"
    }
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next) {
    const account = this;
    if (account.isNew || account.isModified("password")){
        try {
        account.password = bcrypt.hash(account.password, process.env.BCRYPT_SALT);
        } catch (error) {
            console.log(error)
            throw new Error({error: error.message})
        }
    }
});
module.exports = mongoose.model("Account", AccountSchema);
