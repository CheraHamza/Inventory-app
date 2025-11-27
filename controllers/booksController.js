const booksQueries = require("../storage/queries/books");
const authorsQueries = require("../storage/queries/authors");
const genresQueries = require("../storage/queries/genres");

const { body, validationResult } = require("express-validator");

const currentYear = new Date().getFullYear();

const alphanumericError = "must only contain alphanumerical values.";
const titleLengthError = "must be between 1 and 200 characters.";
const urlError = "must be a valid URL.";
const numericError = "must be a number.";
const pagesError = "must be between 1 and 10000 pages.";
const yearError = `must follow these patterns: "2002", "200 BC" and must not exceed ${currentYear}`;
const isbnError = "must contain 10 or 13 characters.";

const validateBook = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("can not be empty.")
		.isLength({ min: 1, max: 200 })
		.withMessage(titleLengthError)
		.custom(async (value, { req }) => {
			const id = req.params.id;
			let books;
			if (id) {
				books = (await booksQueries.getAllBooks()).filter(
					(book) => id != book.id
				);
			} else {
				books = await booksQueries.getAllBooks();
			}
			const titles = books.map((book) => book.title.toLowerCase());

			if (titles.includes(value.toLowerCase())) {
				throw new Error("Title already exists, try another one!");
			}
		})
		.withMessage("Title already exists, try another one."),

	body("cover_url")
		.trim()
		.optional({ checkFalsy: true })
		.isURL()
		.withMessage(urlError),

	body("length")
		.trim()
		.optional({ checkFalsy: true })
		.isInt()
		.withMessage(numericError)
		.isFloat({ min: 1, max: 10000 })
		.withMessage(pagesError),

	body("published_year")
		.trim()
		.optional({ checkFalsy: true })
		.custom((value) => {
			const regex = /^(\d{1,4}|\d{1,4} BC)$/;

			if (!regex.test(value)) {
				throw new Error("unvalid year");
			}

			if (/^\d{1,4}$/.test(value)) {
				const year = parseInt(value, 10);
				if (year > 2025) {
					throw new Error("unvalid year");
				}
			}

			return true;
		})
		.withMessage(yearError),

	body("isbn")
		.trim()
		.notEmpty()
		.withMessage("can not be empty.")
		.isAlphanumeric()
		.withMessage(alphanumericError)
		.custom((value) => {
			if (!value) return false;

			if (value.length === 10 || value.length === 13) {
				return true;
			}

			throw new Error(`ISBN ${isbnError}`);
		})
		.withMessage(isbnError)
		.custom(async (value, { req }) => {
			const id = req.params.id;
			let books;
			if (id) {
				books = (await booksQueries.getAllBooks()).filter(
					(book) => id != book.id
				);
			} else {
				books = await booksQueries.getAllBooks();
			}

			const isbns = books.map((book) => book.isbn.toLowerCase());

			if (isbns.includes(value.toLowerCase())) {
				throw new Error(
					"ISBN already exists, ISBN must be unique for each book"
				);
			}
		})
		.withMessage("ISBN already exists, try another one."),

	body("more_details_url")
		.trim()
		.optional({ checkFalsy: true })
		.isURL()
		.withMessage(urlError),
];

getBooks = async (req, res) => {
	let searchPrompt = req.query.title;

	let books;
	if (searchPrompt && searchPrompt != "") {
		books = await booksQueries.searchBooksByTitle(searchPrompt);
	} else {
		books = await booksQueries.getAllBooks();
	}

	const genres = await genresQueries.getActiveGenres();
	const authors = await authorsQueries.getActiveAuthors();

	for (const book of books) {
		const authors = await booksQueries.getBookAuthors(book.id);
		const genres = await booksQueries.getBookGenres(book.id);

		book.authors = authors;
		book.genres = genres;
	}

	res.render("books", {
		title: "Books",
		books,
		authors,
		genres,
		searchPrompt: searchPrompt,
	});
};

getAddBook = async (req, res) => {
	const existingAuthors = await authorsQueries.getAllAuthors();
	const existingGenres = await genresQueries.getAllGenres();

	res.render("forms/book", {
		title: "Add Book",
		action: "add",
		existingAuthors,
		existingGenres,
	});
};

const postAddBook = [
	validateBook,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const existingAuthors = await authorsQueries.getAllAuthors();
			const existingGenres = await genresQueries.getAllGenres();

			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/book", {
				title: "Add Book",
				action: "add",
				existingAuthors,
				existingGenres,
				errors: groupedErrors,
				previousValues: req.body,
			});
		}

		const {
			title,
			cover_url,
			length,
			published_year,
			isbn,
			status,
			more_details_url,
			description,
		} = req.body;

		const authors = req.body.selected_authors_names
			.split(", ")
			.filter((name) => name != "");

		const genres = req.body.selected_genres_names
			.split(", ")
			.filter((name) => name != "");

		await booksQueries.addBook(
			title,
			cover_url || `https://placehold.co/300x500?text=No\\nCover`,
			length || "100",
			published_year || "2000",
			isbn,
			status,
			more_details_url || "https://www.goodreads.com/",
			description || "No description was specified for this book.",
			authors,
			genres
		);

		res.redirect("/books");
	},
];

getUpdateBook = async (req, res) => {
	const existingAuthors = await authorsQueries.getAllAuthors();
	const existingGenres = await genresQueries.getAllGenres();

	const bookId = req.params.id;
	const book = await booksQueries.getBookById(bookId);
	const book_authors = await booksQueries.getBookAuthors(bookId);
	const book_genres = await booksQueries.getBookGenres(bookId);

	book.authors = book_authors;
	book.genres = book_genres;

	res.render("forms/book", {
		title: "Update Book",
		action: "update",
		existingAuthors,
		existingGenres,
		bookInfo: book,
	});
};

const postUpdateBook = [
	validateBook,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const existingAuthors = await authorsQueries.getAllAuthors();
			const existingGenres = await genresQueries.getAllGenres();

			const bookId = req.params.id;
			const book = await booksQueries.getBookById(bookId);
			const book_authors = await booksQueries.getBookAuthors(bookId);
			const book_genres = await booksQueries.getBookGenres(bookId);

			book.authors = book_authors;
			book.genres = book_genres;

			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/book", {
				title: "Update Book",
				action: "update",
				existingAuthors,
				existingGenres,
				bookInfo: book,
				errors: groupedErrors,
				previousValues: req.body,
			});
		}

		const id = req.params.id;
		const {
			title,
			cover_url,
			length,
			published_year,
			isbn,
			status,
			more_details_url,
			description,
		} = req.body;

		const authors = req.body.selected_authors_names
			.split(", ")
			.filter((name) => name != "");

		const genres = req.body.selected_genres_names
			.split(", ")
			.filter((name) => name != "");

		await booksQueries.updateBook(
			id,
			title,
			cover_url || `https://placehold.co/300x500?text=No\\nCover`,
			length || "100",
			published_year || "2000",
			isbn,
			status,
			more_details_url || "https://www.goodreads.com/",
			description || "No description was specified for this book.",
			authors,
			genres
		);

		res.redirect("/books");
	},
];

postDeleteBook = async (req, res) => {
	const bookId = req.body.id;

	await booksQueries.deleteBook(bookId);

	res.redirect("/books");
};

module.exports = {
	getBooks,
	getAddBook,
	postAddBook,
	getUpdateBook,
	postUpdateBook,
	postDeleteBook,
};
