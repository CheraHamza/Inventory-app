const pool = require("./pool");

// Books
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
		"select * from books where books.title like $1;",
		[`%${title}%`]
	);

	return rows;
}

async function getBooksByCategory(category) {
	const { rows } = await pool.query(
		"select * from books b join book_genres on books.id = book_genres.book_id join genres on genres.id = book_genres.genre_id where genres.name = $1;",
		[category]
	);

	return rows;
}

async function getBooksByAuthor(id) {
	const { rows } = await pool.query(
		"select * from books b join book_authors on books.id = book_authors.book_id join authors on authors.id = book_authors.author_id where authors.id = $1;",
		[id]
	);

	return rows;
}

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
		authors.forEach(async (name) => {
			const author = await getAuthorByName(name);

			if (!author) {
				await addAuthor(name);
			}

			await addBookAuthor(title, name);
		});
	}

	if (genres) {
		genres.forEach(async (name) => {
			const genre = await getGenreByName(name);

			if (!genre) {
				await addGenre(name);
			}

			await addBookGenre(title, name);
		});
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

	const oldAuthors = await pool.query(
		"select authors.name from authors join book_authors on authors.id = book_authors.author_id where book_authors.book_id = $1",
		[id]
	);

	if (authors) {
		// remove book author relationship
		oldAuthors.forEach(async (name) => {
			if (!authors.includes(name)) {
				await deleteBookAuthor(title, name);
			}
		});

		// add book author relationship and create necessary authors
		authors.forEach(async (name) => {
			if (!oldAuthors.includes(name)) {
				const author = await getAuthorByName(name);
				if (!author) {
					await addAuthor(name);
				}
				await addBookAuthor(title, name);
			}
		});
	}

	const oldGenres = await pool.query(
		"select genres.name from genres join book_genres on genres.id = book_genres.genre_id where book_genres.book_id = $1",
		[id]
	);

	if (genres) {
		// remove book genre relationship
		oldGenres.forEach(async (name) => {
			if (!genres.includes(name)) {
				await deleteBookGenre(title, name);
			}
		});

		// add book genre relationship and create necessary genres
		genres.forEach(async (name) => {
			if (!oldGenres.includes(name)) {
				const genre = await getGenreByName(name);
				if (!genre) {
					await addGenre(name);
				}
				await addBookGenre(title, name);
			}
		});
	}
}

async function deleteBook(id) {
	await pool.query("delete from books where id = $1;", [id]);
	await pool.query("delete from book_authors where book_id = $1;", [id]);
	await pool.query("delete from book_genres where book_id = $1;", [id]);
}

// Authors

async function getAllAuthors() {
	const { rows } = await pool.query("select * from authors;");

	return rows;
}

async function getAuthorById(id) {
	const { rows } = await pool.query("select * from authors where id = $1;", [
		id,
	]);

	return rows[0];
}

async function getAuthorByName(name) {
	const { rows } = await pool.query("select * from authors where name = $1;", [
		name,
	]);

	return rows[0];
}

async function addAuthor(name, picture_url, birth_date, death_date, bio) {
	await pool.query(
		"insert into authors (name, picture_url, birth_date, death_date, bio) values ($1, $2, $3, $4, $5);",
		[name, picture_url, birth_date, death_date, bio]
	);
}

async function updateAuthor(
	id,
	name,
	picture_url,
	birth_date,
	death_date,
	bio
) {
	await pool.query(
		"update authors set name = $1, picture_url = $2, birth_date = $3, death_date = $4, bio = $5 where id = $6 ",
		[name, picture_url, birth_date, death_date, bio, id]
	);
}

async function deleteAuthor(id) {
	await pool.query("delete from authors where id = $1", [id]);
	await pool.query("delete from book_authors where author_id = $1", [id]);
}

// Genres

async function getAllGenres() {
	const { rows } = await pool.query("select * from genres;");

	return rows;
}

async function getGenreById(id) {
	const { rows } = await pool.query("select * from genres where id = $1;", [
		id,
	]);

	return rows[0];
}

async function getGenreByName(name) {
	const { rows } = await pool.query("select * from genres where name = $1;", [
		name,
	]);

	return rows[0];
}

async function addGenre(name, description) {
	await pool.query("insert into genres (name, description) values ($1, $2);", [
		name,
		description,
	]);
}

async function updateGenre(id, name, description) {
	await pool.query(
		"update genres set name = $1, description = $2 where id = $3",
		[name, description, id]
	);
}

async function deleteGenre(id) {
	await pool.query("delete from genres where id = $1", [id]);
	await pool.query("delete from book_genres where genre_id = $1", [id]);
}

// Book_authors

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
	getBooksByAuthor,
	getBooksByCategory,
	searchBooksByTitle,
	addBook,
	updateBook,
	deleteBook,
};

module.exports = {
	getAllAuthors,
	getAuthorById,
	getAuthorByName,
	addAuthor,
	updateAuthor,
	deleteAuthor,
};

module.exports = {
	getAllGenres,
	getGenreById,
	getGenreByName,
	addGenre,
	updateGenre,
	deleteGenre,
};
