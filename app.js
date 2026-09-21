// const http = require('node:http')

const fs = require('node:fs')
// const htmlContent = fs.readFileSync('./views/index.html', 'utf-8')
// const cssFile = fs.readFileSync('./views/style.css', 'utf-8')

// const server = http.createServer((request, response) => {
//     console.log("=>", request.url)

//     if(request.url ===  "/") {
        
//         response.write(htmlContent)

//     }else if(request.url === "/about"){
        
//         response.write("<h1> you are in about page </h1>")

//     } else if (request.url === '/content') {
//         response.write("<h1>Here's the content</h1>")

//     } else if(request.url === '/style.css'){
//         response.write(cssFile)

//     }else {
//         response.statusCode = 404
//     } 
//     response.end()
// })

// server.listen(3001, () => {
//     console.log("listening on port 3001")
// })



// const express = require('express')

// const app = express()

// // app.use(express.static('./views'))

// app.use((req, res, next) => {
//     console.log("METHOD:", req.method, "URL:", req.url)
//     next()
// })


// // function logger(req) {
// //     console.log("METHOD:", req.method, "URL:", req.url)
// // }

// app.get('/hello', (req, res) => {
//     // logger(req)
//     console.log(req)
//     res.send('hello world')
// })

// app.get('/about', (req, res) => {
//     // logger(req)
//     res.send('about page')
// })


// app.get('/products', (req, res) => {
//     res.send(
//         [
//             {id:1, name:"product1"},
//             {id:2, name:"product2"},
//             {id:3, name:"product3"},
//             {id:4, name:"product4"},
//             {id:5, name:"product5"},
//         ]
//     )
// })

// app.listen(3001, 'localhost', () => {
//     console.log(`express app listening on port 3001`)
// })







// how to use mongodb in my project 
// const {MongoClient} = require('mongodb')

// let url = 'mongodb://localhost:27017';

// let client = new MongoClient(url)


// const main = async() => {
//     // Use connect method to connect to the server
//     await client.connect()
//     console.log("connected successfully to the server")

//     const db = client.db('codeZone') 
//     const collection = db.collection("courses")
//     await collection.insertOne({
//         title:"newCourse",
//         price:2000
//         })

//     const data = await collection.find().toArray()
    
//     console.log('DATA => ', data)
//     console.log("InsertedResult",inserResult)

// }
// main()


 
const dotEnv = require('dotenv').config()

const express = require('express')

const cors = require('cors')



const mongoose = require('mongoose')



mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongodb connected successfuly")
})

console.log(process.env.MONGO_URL)


const app = express()

app.use(express.json())
app.use(cors())


const httpStatusText = require('./utils/httpStatusCode')

const coursesRouter = require('./Routes/courses.route')

const usersRouter = require('./Routes/user.route')

const path = require('path')
// handle routers
app.use('/api/courses', coursesRouter) // middleware
app.use('/api/users', usersRouter)

app.use('/upload', express.static(path.join(__dirname, 'uploads')))


const AppError = require('./utils/appError')


// global error handler
app.use((error, req, res, next) => {
    res.json({status: httpStatusText.ERROR, message: error.message})
})

// global middleware for not found routes 
app.all("/*splat", (req, res, next) => {
    return res.status(AppError.statusCode).json({status:httpStatusText.ERROR, message:"This resourse  is not found"})
})


app.listen(process.env.PORT, () => {
    console.log("listeninng on port 5000")
})