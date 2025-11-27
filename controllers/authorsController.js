const booksQueries = require("../storage/queries/books");
const authorsQueries = require("../storage/queries/authors");

const { body, validationResult } = require("express-validator");

const currentYear = new Date().getFullYear();

const alphaError = "must only contain alphabetic characters.";
const nameLengthError = "must be between 3 and 200 characters.";
const urlError = "must be a valid URL.";
const birthyearError = `must follow these patterns: "2002", "200 BC" and must not exceed ${currentYear}`;
const deathyearError = `must follow these patterns: "Present", "2002", "200 BC" and must not exceed ${currentYear}`;

const validateAuthor = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("cannot be empty.")
		.matches(/^[A-Za-z ]+$/)
		.withMessage(alphaError)
		.isLength({ min: 3, max: 200 })
		.withMessage(nameLengthError)
		.custom(async (value, { req }) => {
			const id = req.params.id;
			let authors;
			if (id) {
				authors = (await authorsQueries.getAllAuthors()).filter(
					(author) => id != author.id
				);
			} else {
				authors = await authorsQueries.getAllAuthors();
			}
			const names = authors.map((author) => author.name.toLowerCase());

			if (names.includes(value.toLowerCase())) {
				throw new Error("Author name already exists");
			}
		})
		.withMessage("Author name already exists, try another one."),

	body("picture_url")
		.trim()
		.optional({ checkFalsy: true })
		.isURL()
		.withMessage(urlError),

	body("birth_year")
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
		.withMessage(birthyearError),

	body("death_year")
		.trim()
		.optional({ checkFalsy: true })
		.custom((value) => {
			const regex = /^(Present|\d{1,4}|\d{1,4} BC)$/;

			if (!regex.test(value)) {
				throw new Error("unvalid year");
			}

			if (/^\d{1,4}$/.test(value)) {
				const year = parseInt(value, 10);
				if (year > currentYear) {
					throw new Error("unvalid year");
				}
			}

			return true;
		})
		.withMessage(deathyearError),
];

getAuthors = async (req, res) => {
	const searchPrompt = req.query.authorName;
	let authors;
	if (searchPrompt && searchPrompt != "") {
		authors = await authorsQueries.searchAuthorsByName(searchPrompt);
	} else {
		authors = await authorsQueries.getAllAuthors();
	}

	for (const author of authors) {
		const authorBooks = await booksQueries.getBooksByAuthor(author.id);

		author.works = authorBooks;
	}

	res.render("authors", {
		title: "Authors",
		authors,
		searchPrompt: searchPrompt,
	});
};

getAddAuthor = async (req, res) => {
	res.render("forms/author", { title: "Add Author", action: "add" });
};

const postAddAuthor = [
	validateAuthor,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/author", {
				title: "Add Author",
				action: "add",
				errors: groupedErrors,
				previousValues: req.body,
			});
		}

		const { name, picture_url, birth_year, death_year, bio } = req.body;

		await authorsQueries.addAuthor(
			name,
			picture_url || `https://placehold.co/300x500?text=No\\nPicture`,
			birth_year || "2002",
			death_year || "Present",
			bio || "No biography was specified for this author."
		);

		res.redirect("/authors");
	},
];

getUpdateAuthor = async (req, res) => {
	const authorId = req.params.id;

	const authorInfo = await authorsQueries.getAuthorById(authorId);

	res.render("forms/author", {
		title: "Update Author",
		action: "update",
		authorInfo,
	});
};

const postUpdateAuthor = [
	validateAuthor,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const authorId = req.params.id;

			const authorInfo = await authorsQueries.getAuthorById(authorId);

			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/author", {
				title: "Update Author",
				action: "update",
				authorInfo,
				errors: groupedErrors,
				previousValues: req.body,
			});
		}
		const author_id = req.params.id;

		const { name, picture_url, birth_year, death_year, bio } = req.body;

		await authorsQueries.updateAuthor(
			author_id,
			name,
			picture_url || `https://placehold.co/300x500?text=No\\nPicture`,
			birth_year || "2002",
			death_year || "Present",
			bio || "No biography was specified for this author."
		);

		res.redirect("/authors");
	},
];

postDeleteAuthor = async (req, res) => {
	const author_id = req.body.id;

	await authorsQueries.deleteAuthor(author_id);

	res.redirect("/authors");
};

module.exports = {
	getAuthors,
	getAddAuthor,
	postAddAuthor,
	getUpdateAuthor,
	postUpdateAuthor,
	postDeleteAuthor,
};
