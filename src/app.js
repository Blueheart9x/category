import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import apiRouter from './routes/api'
import config from './utils/config'
import ErrorResponseBody from './common/models/response/error_response_body'
import { ResponseCode } from './common/constants/response'

var app = express()

const mongoOptions = {
  user: config.db.username,
  pass: config.db.password,
  useNewUrlParser: true
}
const mongoConnection = `mongodb://${config.db.host}/${config.db.name}?authSource=${config.db.name}`

mongoose.connect(mongoConnection, mongoOptions)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.set('secret', config.secret)
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(error, req, res, next) {
  const responseBody = new ErrorResponseBody(error.message)
  res.status(error.status || ResponseCode.INTERNAL_SERVER_ERROR).json(responseBody)
})

app.listen(config.port)

console.log(`RESTful API server started on localhost:${config.port}`)

export default app
