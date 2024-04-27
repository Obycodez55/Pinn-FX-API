require("dotenv").config();

const express = require("express");

const connectDB = require("./db/db");

const app = express();
const PORT = process.env.PORT || 5000;
const AuthRoute = require("./routes/auth");
const AccountRoute = require("./routes/account");
const TransactionRoute = require("./routes/transaction");

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AuthRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  