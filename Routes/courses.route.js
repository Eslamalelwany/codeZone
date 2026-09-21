
const express = require('express')

const userRoles = require('../utils/userRoles')
const allowedTo = require('../middleware/allowedTo')

const {body, validationResult} = require('express-validator')

const router = express.Router()

let coursesController = require('../controllers/courses.controller')

const {validationSchema} = require('../middleware/validationSchema')

const verifyToken = require('../middleware/VerifyToken')

// GET all courses 
router.route('/').get(coursesController.getAllCourse)

// create new course
router.route('/').post(verifyToken,  allowedTo(userRoles.ADMIN, userRoles.MANAGER), validationSchema , coursesController.createNewCourse)


router.route('/:Id')
                    .get(coursesController.getSingleCourse)
                    .patch(verifyToken, body("title").notEmpty(), coursesController.updateCourse)
                    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER),  coursesController.deleteCourse)

                    
module.exports = router;