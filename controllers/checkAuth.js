const jwt = require("jsonwebtoken");
const httpStatusCode = require("http-status-codes");

const checkAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) {
        return res.sendStatus(httpStatusCode.StatusCodes.UNAUTHORIZED);
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(httpStatusCode.StatusCodes.FORBIDDEN);
        }
        req.user = user;
        next();
    });
};

module.exports = {
    checkAuth,
};
