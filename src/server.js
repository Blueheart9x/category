import express from "express"
import "express-async-errors"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import apiRouter from "./routes/api_router"
import config from "./utils/config"
import ErrorResponseBody from "./common/models/response/error_response_body"
import { ResponseCode } from "./common/constants/response_consts"
import cors from "cors"
import { SecretStorage } from "./common/constants/system_consts"

var app = express()

const mongoOptions = {
  user: config.db.username,
  pass: config.db.password,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
}

const mongoConnection = `mongodb://${config.db.host}/${config.db.name}?authSource=${config.db.name}`

mongoose.set("useCreateIndex", true)
mongoose.connect(mongoConnection, mongoOptions)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.set(SecretStorage.TOKEN, config.secret)

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api", apiRouter)

// handle 404
app.use(function(req, res, next) {
  const responseBody = new ErrorResponseBody("End-point not found")
  res.status(ResponseCode.NOT_FOUND).json(responseBody)
})

// handle error
app.use(function(error, req, res, next) {
  console.log(error)
  const responseBody = new ErrorResponseBody(error.message, error.errors)
  res.status(error.status || ResponseCode.INTERNAL_SERVER_ERROR).json(responseBody)
})

app.listen(config.port)

console.log(`RESTful API server started on localhost:${config.port}`)

export default app
