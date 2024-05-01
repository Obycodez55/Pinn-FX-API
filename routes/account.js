const express = require('express');
const ensureAuth = require("../middlewares/ensureAuth.js");
const errorHandler = require("../middlewares/errorHandler.js");
const tryCatch = require("../Utils/tryCatch.js");
const { getAccountDetails, addToBalance } = require("../services/accountServices.js")

const router = express.Router();

router.use(errorHandler);

router.get("/account/details", ensureAuth, (req, res) => {
    tryCatch(getAccountDetails(req, res));
})

router.post("/account/balance/add", ensureAuth, (req, res,next) => {
    addToBalance(req, res, next);
})

module.exports = router;