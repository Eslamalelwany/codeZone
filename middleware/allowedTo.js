const AppError = require("../utils/appError")

module.exports = (...roles) => {
    console.log("roles", roles)
    
    return (req, res, next) => {
        
        console.log("This is the role", req.currentUser.payload.role)

        if(!roles.includes(req.currentUser.payload.role)) {
            return next(AppError.create('this role is not authorized', 401))
        }
        next()
    }
}