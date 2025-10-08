const express = require("express");
const path = require("path");

const libraryRouter = require("./routes/libraryRouter");

const app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}

	console.log(`library express app is running on port ${PORT}`);
});

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", libraryRouter);
