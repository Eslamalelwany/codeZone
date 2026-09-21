
const { validationResult } = require('express-validator')
const Course = require('../model/courses.model')
const asyncWrapper = require('../middleware/asyncWrapper')


const httpStatusText = require('../utils/httpStatusCode')

const AppError = require('../utils/appError')


const getAllCourse = async (req, res) => {
    const query = req.query
    console.log("query=================================")
    console.log("Query =>", query)
    const limit = query.limit || 2;
    const page = query.page || 1; 
    const skip = (page - 1) * limit;
    // get all courses from DB using course model
    const courses = await Course.find({}, {__v:false, "price": false}).limit(limit).skip(skip)
    console.log(courses)
    res.json({status:httpStatusText.SUCCESS, data:{courses: courses}})
}


const getSingleCourse = asyncWrapper (
    async(req, res) => {
    
    // find the course by id 
        const course = await Course.findById(req.params.Id)
        if(!course) {
            // res.status(404).json({status:httpStatusText.FAIL, data:{course: null}})
            const error = AppError.create("NOT FOUND", 404, "Course not found")
            next(error) 
        }
        return res.json({status:httpStatusText.SUCCESS, data:{course}})
}
)


const createNewCourse = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({status:httpStatusText.FAIL, data: errors.array()})
    }

    const newCourse = new Course(req.body)  
    await newCourse.save()

    res.status(201).json(res.json({status:httpStatusText.SUCCESS, data:{course: newCourse}}))
}

const updateCourse = async (req, res) => {

    const id = req.params.Id
    try {
        const course = await Course.findByIdAndUpdate(id, {$set: {...req.body}})
        return res.status(200).json({status:httpStatusText.FAIL, data:{course: course}})
    }
    catch (e) {
        return res.status(400).send(error.array());
    }
    const error = validationResult({status:httpStatusText.ERROR, data:error.array()})
}


const deleteCourse = async (req, res) => {
    const course = await Course.deleteOne(req.params.id)
    res.status(200).send(res.json({status:httpStatusText.SUCCESS, data:{course:null}}))
    
}


module.exports = {
    getAllCourse,
    getSingleCourse,
    createNewCourse,
    updateCourse,
    deleteCourse
}