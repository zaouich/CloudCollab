const express = require("express");
const errController = require("./controllers/errController");
const cookieParser = require("cookie-parser");

const app = express();
const filesRouter = require("./routers/filesRouter");
const usersRouter = require("./routers/usersRouter");
const cors = require("cors");

app.use(cookieParser());
app.use((req, res, next) => {
	console.log(req.cookies);
	next();
});
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);
app.use(express.json());
app.use("/api/v1/files", filesRouter);
app.use("/api/v1/users", usersRouter);
app.use(errController);

module.exports = app;
