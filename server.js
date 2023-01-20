const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
mongoose.set("strictQuery", true);
mongoose.set("strictPopulate", false);

dotenv.config({ path: "./config.env" });
mongoose
	.connect(process.env.DB)
	.then(() => console.log("connected to the db ***"));

app.listen(3000, () => {
	console.log("listning to the port 8080.....");
});
