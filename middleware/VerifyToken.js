const jwt = require('jsonwebtoken')
const httpStatusText = require('../utils/httpStatusCode');

const AppError = require('../utils/appError')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if (!authHeader) {
        const error = AppError.create('Unauthorized', 401 , httpStatusText.ERROR)
        return next(error)
    }

    console.log("Token", token)
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser
        console.log("current User", currentUser)

        next()
    }

    catch(error) {
        error = AppError.create('Invalid Token', 401 , httpStatusText.ERROR)
        return next(error)
    }
}

module.exports = verifyToken;

