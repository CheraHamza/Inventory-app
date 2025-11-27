const booksQueries = require("../storage/queries/books");
const genresQueries = require("../storage/queries/genres");

const { body, validationResult } = require("express-validator");

const alphanumericError = "must only contain alphanumeric characters.";
const nameLengthError = "must be between 3 and 200 characters.";
const urlError = "must be a valid URL.";

const validateGenre = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("cannot be empty.")
		.matches(/^[A-Za-z0-9 ]+$/)
		.withMessage(alphanumericError)
		.isLength({ min: 3, max: 200 })
		.withMessage(nameLengthError)
		.custom(async (value, { req }) => {
			const id = req.params.id;
			let genres;
			if (id) {
				genres = (await genresQueries.getAllGenres()).filter(
					(genre) => id != genre.id
				);
			} else {
				genres = await genresQueries.getAllGenres();
			}
			const names = genres.map((genre) => genre.name.toLowerCase());

			if (names.includes(value.toLowerCase())) {
				throw new Error("Genre name already exists");
			}
		})
		.withMessage("Genre name already exists, try another one."),
	,
	body("picture_url")
		.trim()
		.optional({ checkFalsy: true })
		.isURL()
		.withMessage(urlError),
];


getGenres = async (req, res) => {
	const searchPrompt = req.query.genreName;
	let genres;

	if (searchPrompt && searchPrompt != "") {
		genres = await genresQueries.searchGenresByName(searchPrompt);
	} else {
		genres = await genresQueries.getAllGenres();
	}

	for (const genre of genres) {
		const books = await booksQueries.getBooksByGenre(genre.id);
		genre.books = books;
	}

	res.render("genres", {
		title: "Genres",
		genres,
		searchPrompt: searchPrompt,
	});
};

getAddGenre = async (req, res) => {
	res.render("forms/genre", { title: "Add Genre", action: "add" });
};

const postAddGenre = [
	validateGenre,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/genre", {
				title: "Add Genre",
				action: "add",
				errors: groupedErrors,
				previousValues: req.body,
			});
		}

		const { name, picture_url, description } = req.body;

		await genresQueries.addGenre(
			name,
			picture_url || `https://placehold.co/200x200?text=No\\nPicture`,
			description || "No description was specified for this genre."
		);

		res.redirect("/genres");
	},
];

getUpdateGenre = async (req, res) => {
	const genre_id = req.params.id;

	const genreInfo = await genresQueries.getGenreById(genre_id);

	res.render("forms/genre", {
		title: "Update Genre",
		action: "update",
		genreInfo,
	});
};

const postUpdateGenre = [
	validateGenre,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const genre_id = req.params.id;

			const genreInfo = await genresQueries.getGenreById(genre_id);

			const groupedErrors = errors.array().reduce((acc, { path, msg }) => {
				(acc[path] ||= []).push(msg);
				return acc;
			}, {});

			return res.status(400).render("forms/genre", {
				title: "Update Genre",
				action: "update",
				genreInfo,
				errors: groupedErrors,
				previousValues: req.body,
			});
		}

		const genre_id = req.params.id;

		const { name, picture_url, description } = req.body;

		await genresQueries.updateGenre(
			genre_id,
			name,
			picture_url || `https://placehold.co/200x200?text=No\\nPicture`,
			description || "No description was specified for this genre."
		);

		res.redirect("/genres");
	},
];

postDeleteGenre = async (req, res) => {
	const genre_id = req.body.id;

	await genresQueries.deleteGenre(genre_id);

	res.redirect("/genres");
};

module.exports = {
	getGenres,
	getAddGenre,
	postAddGenre,
	getUpdateGenre,
	postUpdateGenre,
	postDeleteGenre,
};
