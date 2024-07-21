const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app