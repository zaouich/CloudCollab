const express = require("express")
const errController = require("./controllers/errController")
const app = express()
const filesRouter = require("./routers/filesRouter")
const usersRouter = require("./routers/usersRouter")
const cors = require("cors")
app.use(cors({
    origin: "http://localhost:3001"
}));
app.use(express.json())
app.use("/api/v1/files",filesRouter)
app.use("/api/v1/users",usersRouter)
app.use(errController)

module.exports = app