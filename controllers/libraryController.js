const database = require("../storage/queries");
const { body, validationResult } = require("express-validator");

getIndex = async (req, res) => {
	const books = await database.getAllBooks();
	console.log(books);

	res.render("index", { books });
};

module.exports = {
	getIndex,
};
