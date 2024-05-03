require("dotenv").config();

const express = require("express");

const connectDB = require("./db/db");

const app = express();
const PORT = process.env.PORT || 5000;
const AuthRoute = require("./routes/auth");
const AccountRoute = require("./routes/account");
const TransactionRoute = require("./routes/transaction");
const CustomError = require("./Utils/CustomError");
const errorHandler = require("./middlewares/errorHandler");

// const schedule = require("./Utils/Scheduler");
// schedule();
// Connect to DB
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AuthRoute);
app.use(AccountRoute);
app.use(TransactionRoute);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
