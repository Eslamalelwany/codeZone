
const express = require('express')

const {body, validationResult} = require('express-validator')

const router = express.Router()

const usersController = require('../controllers/users.controller')

// Get all users 
// Register
// Login



const multer = require('multer') 

const discStorage = multer.diskStorage({
    destination : function (req, file,  cb) {
        console.log('file=> ', file)
        cb(null, 'uploads')
    },
    filename: function (req, file , cb) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]

    if (imageType == 'image') {
        return cb(null, true) 
    }else {
        return cb(AppError.create('the file must me an image', 400), false)
    }
}

const upload = multer({storage: discStorage ,
    fileFilter: fileFilter

})

const verifyToken = require('../middleware/VerifyToken')
const AppError = require('../utils/appError')

router.route('/').get(verifyToken ,usersController.getAllUsers)
                

// Register
router.route('/register').post(upload.single('avatar'), usersController.register)

// Login
router.route('/login').post(usersController.login)


module.exports = router;