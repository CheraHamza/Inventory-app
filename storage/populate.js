const { Client } = require("pg");
require("dotenv").config();

const SQL = `
    Insert Into books (title, cover_url, length, published_year, isbn, status, more_details_url)
    Values
    ('Thirst for Love','https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1624920217i/62801.jpg', 200, 1950, '9780375705076', 'read', 'https://www.goodreads.com/book/show/62801.Thirst_for_Love');
`;


async function main() {
	console.log("seeding...");

	const host = process.env.DB_HOST;
	const user = process.env.DB_USER;
	const database = process.env.DATABASE;
	const password = process.env.DB_PASSWORD;
	const port = process.env.DB_PORT;

	const client = new Client({
		connectionString: `postgresql://${user}:${password}@${host}:${port}/${database}`,
	});
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log("Done.");
}

main();
