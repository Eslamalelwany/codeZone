const {body} = require('express-validator')


const validationSchema  = body('title').notEmpty()


module.exports = {
    validationSchema
}