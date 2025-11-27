const pool = require("../pool");

async function getAllGenres() {
	const { rows } = await pool.query("select * from genres;");

	return rows;
}

async function getActiveGenres() {
	const { rows } = await pool.query(
		"select distinct genres.* from genres join book_genres on genres.id = book_genres.genre_id;"
	);

	return rows;
}

async function getGenreById(id) {
	const { rows } = await pool.query("select * from genres where id = $1;", [
		id,
	]);

	return rows[0];
}

async function searchGenresByName(name) {
	const { rows } = await pool.query(
		"select * from genres where genres.name ilike $1;",
		[`%${name}%`]
	);

	return rows;
}

async function getGenreByName(name) {
	const { rows } = await pool.query(
		"select * from genres where name ilike $1;",
		[name]
	);

	return rows[0];
}

async function addGenre(name, picture_url, description) {
	await pool.query(
		"insert into genres (name, picture_url, description) values ($1, $2, $3);",
		[name, picture_url, description]
	);
}

async function updateGenre(id, name, picture_url, description) {
	await pool.query(
		"update genres set name = $1, picture_url = $2, description = $3 where id = $4",
		[name, picture_url, description, id]
	);
}

async function deleteGenre(id) {
	await pool.query("delete from book_genres where genre_id = $1", [id]);
	await pool.query("delete from genres where id = $1", [id]);
}

module.exports = {
	getAllGenres,
	getGenreById,
	getGenreByName,
	searchGenresByName,
	getActiveGenres,

	addGenre,
	updateGenre,
	deleteGenre,
};
