// imports
const jwt = require('jsonwebtoken');
// imports

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        var decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        res.status(401).send({
            message: 'token verify failed'
        })
    }
}