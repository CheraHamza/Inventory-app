const pool = require("../pool");
const authorQueries = require("./authors");
const genresQueries = require("./genres");

async function getAllBooks() {
	const { rows } = await pool.query("select * from books;");
	return rows;
}

async function getBookById(id) {
	const { rows } = await pool.query(
		"select * from books where books.id = $1;",
		[id]
	);

	return rows[0];
}

async function searchBooksByTitle(title) {
	const { rows } = await pool.query(
		"select * from books where books.title ilike $1;",
		[`%${title}%`]
	);

	return rows;
}

async function getBooksByGenre(id) {
	const { rows } = await pool.query(
		"select books.* from books join book_genres on books.id = book_genres.book_id where book_genres.genre_id = $1;",
		[id]
	);

	return rows;
}

async function getBooksByAuthor(id) {
	const { rows } = await pool.query(
		"select books.* from books join book_authors on books.id = book_authors.book_id where book_authors.author_id = $1;",
		[id]
	);

	return rows;
}

const genrePlaceholderData = {
	picture_url: `https://placehold.co/200x200?text=No\\nPicture`,
	description: "No description was specified for this genre.",
};

const authorPlacehoderData = {
	picture_url: `https://placehold.co/300x500?text=No\\nPicture`,
	birth_year: "2002",
	death_year: "Present",
	bio: "No biography was specified for this author.",
};

async function addBook(
	title,
	cover_url,
	length,
	published_year,
	isbn,
	status,
	more_details_url,
	description,
	authors,
	genres
) {
	await pool.query(
		"insert into books (title, cover_url, length, published_year, isbn, status, more_details_url, description) Values ($1, $2, $3, $4, $5, $6, $7, $8);",
		[
			title,
			cover_url,
			length,
			published_year,
			isbn,
			status,
			more_details_url,
			description,
		]
	);

	if (authors) {
		for (const name of authors) {
			const author = await authorQueries.getAuthorByName(name);

			if (!author) {
				await authorQueries.addAuthor(
					name,
					authorPlacehoderData.picture_url,
					authorPlacehoderData.birth_year,
					authorPlacehoderData.death_year,
					authorPlacehoderData.bio
				);
			}

			await addBookAuthor(title, name);
		}
	}

	if (genres) {
		for (const name of genres) {
			const genre = await genresQueries.getGenreByName(name);

			if (!genre) {
				const picture_url = `https://placehold.co/200x200?text=No\\nPicture`;
				const description = "No description was specified for this genre.";

				await genresQueries.addGenre(
					name,
					genrePlaceholderData.picture_url,
					genrePlaceholderData.description
				);
			}

			await addBookGenre(title, name);
		}
	}
}

async function updateBook(
	id,
	title,
	cover_url,
	length,
	published_year,
	isbn,
	status,
	more_details_url,
	description,
	authors,
	genres
) {
	await pool.query(
		"update books set title = $1, cover_url = $2, length = $3, published_year = $4, isbn = $5, status = $6, more_details_url = $7, description = $8 where books.id = $9;",
		[
			title,
			cover_url,
			length,
			published_year,
			isbn,
			status,
			more_details_url,
			description,
			id,
		]
	);

	const oldAuthorsNames = (await getBookAuthors(id)).map(
		(author) => author.name
	);

	if (authors) {
		// remove book author relationship
		if (oldAuthorsNames) {
			for (const name of oldAuthorsNames) {
				if (!authors.includes(name)) {
					await deleteBookAuthor(title, name);
				}
			}
		}

		// add book author relationship and create necessary authors

		for (const name of authors) {
			if (oldAuthorsNames && !oldAuthorsNames.includes(name)) {
				const author = await authorQueries.getAuthorByName(name);
				if (!author) {
					await authorQueries.addAuthor(
						name,
						authorPlacehoderData.picture_url,
						authorPlacehoderData.birth_year,
						authorPlacehoderData.death_year,
						authorPlacehoderData.bio
					);
				}
				await addBookAuthor(title, name);
			}
		}
	}

	const oldGenresNames = (await getBookGenres(id)).map((genre) => genre.name);

	if (genres) {
		// remove book genre relationship
		if (oldGenresNames) {
			for (const name of oldGenresNames) {
				if (!genres.includes(name)) {
					await deleteBookGenre(title, name);
				}
			}
		}

		// add book genre relationship and create necessary genres
		for (const name of genres) {
			if (oldGenresNames && !oldGenresNames.includes(name)) {
				const genre = await genresQueries.getGenreByName(name);
				if (!genre) {
					await genresQueries.addGenre(
						name,
						genrePlaceholderData.picture_url,
						genrePlaceholderData.description
					);
				}
				await addBookGenre(title, name);
			}
		}
	}
}

async function deleteBook(id) {
	await pool.query("delete from book_authors where book_id = $1;", [id]);
	await pool.query("delete from book_genres where book_id = $1;", [id]);
	await pool.query("delete from books where id = $1;", [id]);
}

// Book_authors

async function getBookAuthors(id) {
	const { rows } = await pool.query(
		"select authors.* from authors join book_authors on authors.id = book_authors.author_id where book_authors.book_id = $1",
		[id]
	);

	return rows;
}

async function addBookAuthor(title, name) {
	await pool.query(
		"insert into book_authors (book_id, author_id) values ((select id from books where title = $1), (select id from authors where name = $2));",
		[title, name]
	);
}

async function deleteBookAuthor(title, name) {
	await pool.query(
		"delete from book_authors where book_id =(select id from books where title = $1) and author_id = (select id from authors where name = $2);",
		[title, name]
	);
}

// Book_genres

async function getBookGenres(id) {
	const { rows } = await pool.query(
		"select genres.* from genres join book_genres on genres.id = book_genres.genre_id where book_genres.book_id = $1",
		[id]
	);

	return rows;
}

async function addBookGenre(title, name) {
	await pool.query(
		"insert into book_genres (book_id, genre_id) values ((select id from books where title = $1), (select id from genres where name = $2));",
		[title, name]
	);
}

async function deleteBookGenre(title, name) {
	await pool.query(
		"delete from book_genres where book_id = (select id from books where title = $1) and genre_id = (select id from genres where name = $2);",
		[title, name]
	);
}

module.exports = {
	getAllBooks,
	getBookById,
	searchBooksByTitle,
	getBooksByAuthor,
	getBooksByGenre,

	getBookAuthors,
	getBookGenres,

	addBook,
	updateBook,
	deleteBook,
};
