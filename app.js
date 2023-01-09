const express = require("express")
const errController = require("./controllers/errController")
const app = express()
const filesRouter = require("./routers/filesRouter")
app.use(express.json())
app.use("/api/v1/files",filesRouter)
app.use(errController)

module.exports = app