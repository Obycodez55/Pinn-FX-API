const mongoose = require("mongoose");
const crypto = require("crypto");
const { JWTTimestamp } = require("jsonwebtoken");

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
    },
    verify: {
      type: Boolean,
      default: false
    },
    details: {
      type: mongoose.Types.ObjectId,
      ref: "Account_details"
    },
    token: {
      type: String,
    },
    linkedAccounts: {
      type: [mongoose.Types.ObjectId],
      ref: "Linked_account"
    },
    lastLogin: {
      type: Date,
      default: Date.now()
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
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
      throw new Error(error.message);
    }
  }
  next();
});

AccountSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

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
