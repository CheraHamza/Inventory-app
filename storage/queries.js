const pool = require("./pool");

async function getAllBooks() {
	const { rows } = await pool.query("select * from books");
	return rows;
}

module.exports = {
	getAllBooks,
};
