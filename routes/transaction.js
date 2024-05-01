const express = require('express');
const ensureAuth = require("../middlewares/ensureAuth.js");
const errorHandler = require("../middlewares/errorHandler.js");
const tryCatch = require("../Utils/tryCatch.js");

const {test, deposit} = require("../services/transactionServices.js");

const router = express.Router();

router.use(errorHandler);

router.get("/transaction", (req, res, next) => {
    tryCatch(test(req, res, next));
})

router.post("/transaction/deposit", ensureAuth, (req, res, next) => {
    tryCatch(deposit(req, res,next));
})



module.exports = router;