const jwt = require("jsonwebtoken");
const { genericMessage } = require("../utils/Message");

module.exports = (req, res, next) => {
    try {
        // console.log(req.header('Authorization').split(' ')[1] );
        const token = req.header("x-auth-token");
        if (!token) return  res.status(403).send( genericMessage(403, false, "Access denied." ));

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).send( genericMessage(400, false, error.message));
    }
};