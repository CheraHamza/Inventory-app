const { Client } = require("pg");
require("dotenv").config();

const SQL = `
	create type book_status as enum ('nostatus', 'wanttoread', 'reading', 'read');

	Create table if not exists books (
		id Integer Primary Key Generated Always As Identity,
		title varchar(255) unique not null,
		cover_url text,
		length integer,
		published_year text,
		isbn varchar(20) unique,
		status book_status not null,
		more_details_url text,
		description text
	);

	create table if not exists authors (
		id integer primary key generated always as identity,
		name varchar(255) unique not null,
		picture_url text,
		birth_year text,
		death_year text,
		bio text
	);

	create table if not exists genres (
		id integer primary key generated always as identity,
		name varchar(255) unique not null,
		picture_url text,
		description text
	);

	create table if not exists book_authors (
		book_id integer references books(id),
		author_id integer references authors(id),
		primary key (book_id, author_id)
	);

	create table if not exists book_genres (
		book_id integer references books(id),
		genre_id integer references genres(id),
		primary key (book_id, genre_id)
	);


`;

async function main() {
	console.log("seeding...");

	const host = process.env.DB_HOST;
	const user = process.env.DB_USER;
	const database = process.env.DATABASE;
	const password = process.env.DB_PASSWORD;
	const port = process.env.DB_PORT;
	const ssl = {
		rejectUnauthorized: true,
		ca: process.env.CA_CERT,
	};

	const client = new Client({ host, user, database, password, port, ssl });
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log("Done.");
}

main();
