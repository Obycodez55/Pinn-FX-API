const express = require('express');
const ensureAuth = require("../middlewares/ensureAuth.js");

const { createAccount, authenticate, update } = require("../services/authServices.js");
const errorHandler = require('../middlewares/errorHandler.js');

const router = express.Router();

router.use(errorHandler);
router.get('/', function (req, res) {
    res.status(200).send("welcome!");
});

router.post("/auth/create", (req, res)=>{
    createAccount(res, req);
})

router.post("/auth/authenticate", (req, res)=>{
    authenticate(res, req);
});

router.put("/account/update", ensureAuth,  (req, res)=>{
    update(res, req);
})
module.exports = router;