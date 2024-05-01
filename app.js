require("dotenv").config();

const express = require("express");

const connectDB = require("./db/db");

const app = express();
const PORT = process.env.PORT || 5000;
const AuthRoute = require("./routes/auth");
const AccountRoute = require("./routes/account");
const TransactionRoute = require("./routes/transaction");
const CustomError = require("./Utils/CustomError");
const errorHandler = require("./middlewares/errorHandler")

// Connect to DB
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AuthRoute);
app.use(AccountRoute);
app.use(TransactionRoute);

const tryCatch = (action) => {
  action(req, res, next).catch(err => next(err));
};

app.all("*", (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
  next(err);
})
app.use(
//   (error, req, res, next) => {
//   error.statusCode = error.statusCode || 500;
//   error.ststus = error.status || error;
//   res.status(error.statusCode).json({
//     status: error.statusCode,
//     message: error.message
//   })
// }
errorHandler
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  