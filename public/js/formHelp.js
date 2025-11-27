const bookSearchBtn = document.querySelector("button.book-search");
if (bookSearchBtn) {
	bookSearchBtn.addEventListener("click", () => {
		const bookTitleInput = document.querySelector("input#title");
		const title = bookTitleInput.value.split(" ").join("+");

		window.open(`https://www.goodreads.com/search?q=${title}`);
	});
}

const authorSearchBtn = document.querySelector("button.author-search");

if (authorSearchBtn) {
	authorSearchBtn.addEventListener("click", () => {
		const authorNameInput = document.querySelector("input#name.author");
		const name = authorNameInput.value.split(" ").join("+");

		window.open(
			`https://www.google.com/search?q=${name}+book+author`,
			"_blank"
		);
	});
}

const genreSearchBtn = document.querySelector("button.genre-search");

if (genreSearchBtn) {
	genreSearchBtn.addEventListener("click", () => {
		const genreNameInput = document.querySelector("input#name.genre");
		const name = genreNameInput.value.split(" ").join("+");

		window.open(`https://www.google.com/search?q=${name}+book+genre`, "_blank");
	});
}
