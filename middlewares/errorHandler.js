const getErrorType = require("../helpers/getErrorType");
const errorHandler = (error, req, res, next) => {
    if (error.code === 11000) {
        return res
          .status(409)
          .send({
            error: `Duplicate account! ${getErrorType(error)} already exists`
          });
      }
      return res.status(500).send(error);
};

module.exports = errorHandler;