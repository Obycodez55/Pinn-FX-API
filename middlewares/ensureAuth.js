const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const { findAccountByEmail } = require("../providers/dbProviders");
const CustomError = require("../Utils/CustomError");

module.exports = async function (req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    const error = new CustomError("Unauthorized: No token provided", 401);
    next(error);
  } else
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        const error = new CustomError("Unauthorized: Invalid token", 401);
        next(error);
      } else {
        try {
          const account = await findAccountByEmail(decoded);
          if (!account) {
            const error = new CustomError("Account does not exist", 404);
            next(error);
          } else {
            req.account = account;
          }
        } catch (error) {
          next(error);
        }
        next();
      }
    } catch (error) {
      error = new CustomError("Bad Request: Invalid Token", 400);
      next(error);
    }
};