
const UsersModel = require('../model/usersModel')
const ayncWrapper = require('../middleware/asyncWrapper')
const httpStatusText = require('../utils/httpStatusCode');
const AppError = require('../utils/appError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const usersModel = require('../model/usersModel');

const generateJWT = require('../utils/generateToken')

const getAllUsers = async(req, res) => {

    const limit = req.query.limit || 2;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit 

    const users = await UsersModel.find({}, {"__v":false , 'password':false}).limit(limit).skip(skip)
    res.json({success: httpStatusText.SUCCESS , data: {users}})
}






const register = async(req, res, next) => {
    const {firstName, lastName, email, password, role} = req.body
    console.log(req.file)
    const oldUser =  await UsersModel.findOne({email:email})
    if (oldUser) {
        const error = AppError.create('User already exist', 200 , httpStatusText.FAIL)
        return next(error)
    }

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UsersModel ({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        role,
        avatar: req.file.filename
    })

    // Generate JWT Token
    const token =  await generateJWT({email:newUser.email, id: newUser._id, role:newUser.role})
    console.log("TOKEN:" , token)

    newUser.token = token
    await newUser.save()
    res.json({success: httpStatusText.SUCCESS , data: {newUser}})
}







const login = async(req, res, next) => {

    const {email, password} = req.body 

    if (!email && !password) {
        const error = AppError.create('Email and Password are required', 400 , httpStatusText.FAIL)
        return next(error)
    }
    
    const user = await UsersModel.findOne({email:email})

    if (!user) {
        const error = AppError.create('User not found', 400 , httpStatusText.FAIL)
        return next(error)
    }
    // Matching password
    const matchedPassword = await bcrypt.compare(password, user.password)

    if (user && matchedPassword) {
        // Logged in successfully 

        const token = await generateJWT({email:user.email, id: user._id, role:user.role})

        return res.status(200).json({status: httpStatusText.SUCCESS, data:{token:token}})

    } else {
        const error = AppError.create('something wrong', 500 , httpStatusText.FAIL)
        return next(error)
    }
}

module.exports = {
    getAllUsers,
    register,
    login,
}

