const express = require('express');
const ensureAuth = require("../middlewares/ensureAuth.js");

const { getAccountDetails, addToBalance } = require("../services/accountServices.js")

const router = express.Router();


router.get("/account/details", ensureAuth, (req, res) => {
    getAccountDetails(req, res);
})

router.post("/account/balance/add", ensureAuth, (req, res) => {
    addToBalance(req, res);
})

module.exports = router;