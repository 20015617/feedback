var jwt = require('jsonwebtoken');
var config = require('../config/properties.js')
var current_time = Date.now() / 1000;
const UserModel = require("../models/UserModel.js");

module.exports = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
    if (token) {
        const tokenVerify = token.split(' ')[1]
        jwt.verify(tokenVerify, config.secretKey, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "user token is not valid"
                }).end();
            }
            if (decoded.exp < current_time) {
                return res.status(401).json({
                    success: false,
                    message: "user token is expired"
                }).end();
            }
            const user = await UserModel.findOne({email: decoded?.email})
            req.auth = user;
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });
    }
}
