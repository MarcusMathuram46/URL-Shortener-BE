const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(500).json({ message: "Token is invalid" });
    }

    const getToken = (req) => {
        const authorization = req.get('authorization');

        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            return authorization.substring(7);
        }

        return null;
    };

    try {
        jwt.verify(getToken(req), JWT_SECRET, (err, decodeId) => {
            if (err) {
                return res.status(401).json({ message: "Invalid Token" });
            }

            req.userId = decodeId.id;
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = authenticate;