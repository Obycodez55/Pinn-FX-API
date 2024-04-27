const jwt = require("jsonwebtoken");

module.exports = function (email){
    const token = jwt.sign(email, process.env.JWT_SECRET);
    return token;
}