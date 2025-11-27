const pool = require("../pool");

async function getAllAuthors() {
	const { rows } = await pool.query("select * from authors;");

	return rows;
}

async function getActiveAuthors() {
	const { rows } = await pool.query(
		"select distinct authors.* from authors join book_authors on authors.id = book_authors.author_id;"
	);

	return rows;
}

async function getAuthorById(id) {
	const { rows } = await pool.query("select * from authors where id = $1;", [
		id,
	]);

	return rows[0];
}

async function searchAuthorsByName(name) {
	const { rows } = await pool.query(
		"select * from authors where authors.name ilike $1;",
		[`%${name}%`]
	);

	return rows;
}

async function getAuthorByName(name) {
	const { rows } = await pool.query(
		"select * from authors where name iLike $1;",
		[name]
	);

	return rows[0];
}

async function addAuthor(name, picture_url, birth_year, death_year, bio) {
	await pool.query(
		"insert into authors (name, picture_url, birth_year, death_year, bio) values ($1, $2, $3, $4, $5);",
		[name, picture_url, birth_year, death_year, bio]
	);
}

async function updateAuthor(
	id,
	name,
	picture_url,
	birth_year,
	death_year,
	bio
) {
	await pool.query(
		"update authors set name = $1, picture_url = $2, birth_year = $3, death_year = $4, bio = $5 where id = $6 ",
		[name, picture_url, birth_year, death_year, bio, id]
	);
}

async function deleteAuthor(id) {
	await pool.query("delete from book_authors where author_id = $1", [id]);
	await pool.query("delete from authors where id = $1", [id]);
}

module.exports = {
	getAllAuthors,
	getAuthorById,
	getAuthorByName,
	searchAuthorsByName,
	getActiveAuthors,

	addAuthor,
	updateAuthor,
	deleteAuthor,
};
