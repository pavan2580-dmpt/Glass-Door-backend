const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        let bearer = token.split(" ");
        let bearerToken = bearer[1];
        if (!bearerToken) {
            return res.status(403).send({
                data: null,
                code: 403,
                message: "Authorization failed,token required"
            })
        }
        const decoded = jwt.verify(bearerToken, process.env.JWT_TOKEN_KEY);
        req.userAuthId = decoded.authId;
    } catch (error) {
        return res.status(401).send({
            code: 401,
            status: 0,
            message: "Unauthorized Token"
        })
    }
    return next();
}