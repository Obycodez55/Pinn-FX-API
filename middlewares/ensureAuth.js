const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const { getByEmail, findByEmail } = require("../providers/dbProviders");

module.exports = async function (req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).send("Unauthorized: Invalid token");
    } else {
      try {
        const account = await findByEmail(Account, decoded);
        if (!account) {
          res.status(403).send("account does not exist");
        } else {
          req.account = account;
        }
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
    next();
  }
};

// module.exports = function(req, res, next){
//     const token = req.cookies.user_token;
  
//     if (!token) {
//       return res.redirect("/user/login");
//     }
  
//     try {
//       const decoded = jwt.verify(token, jwtSecret);
//       req.userId = decoded.userId;
//       next();
//     } catch(error){
//       console.log(error);
//       res.redirect("/");
//     }
//   }