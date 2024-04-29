const tryCatch = (action) => {
    return (req, res, next) => {
        action(req, res, next).catch(err => next(err));
    }
};

module.exports = tryCatch;
