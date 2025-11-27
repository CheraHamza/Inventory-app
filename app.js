const express = require("express");
const path = require("path");

const mainRouter = require("./routes/mainRouter");

const booksRouter = require("./routes/booksRouter");
const authorsRouter = require("./routes/authorsRouter");
const genresRouter = require("./routes/genresRouter");

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

app.use("/", mainRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
