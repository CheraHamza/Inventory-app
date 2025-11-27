const genreFilterBtns = document.querySelectorAll("button.genre");
const authorFilterBtns = document.querySelectorAll("button.author");
const bookElements = document.querySelectorAll(".books > .book");

let genreFilters = [];
let authorFilters = [];


genreFilterBtns.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		if (!e.target.classList.contains("active")) {
			genreFilters.push(e.target.getAttribute("data-genreId"));
		} else {
			genreFilters = genreFilters.filter(
				(genre) => genre !== e.target.getAttribute("data-genreId")
			);
		}
		e.target.classList.toggle("active");
		applyFilters();
	});
});

authorFilterBtns.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		if (!e.target.classList.contains("active")) {
			authorFilters.push(e.target.getAttribute("data-authorId"));
		} else {
			authorFilters = authorFilters.filter(
				(author) => author !== e.target.getAttribute("data-authorId")
			);
		}
		e.target.classList.toggle("active");
		applyFilters();
	});
});

function applyFilters() {
	bookElements.forEach((book) => {
		let isHidden = true;
		if (genreFilters.length === 0 && authorFilters.length === 0) {
			isHidden = false;
		}

		const genres = Array.from(book.children[3].children).map((genreBtn) =>
			genreBtn.getAttribute("data-genreId")
		);
		const authors = Array.from(book.children[2].children).map((authorBtn) =>
			authorBtn.getAttribute("data-authorId")
		);

		for (const genreId of genres) {
			if (genreFilters.includes(genreId)) {
				isHidden = false;
				break;
			}
		}
		for (const authorId of authors) {
			if (authorFilters.includes(authorId)) {
				isHidden = false;
				break;
			}
		}

		book.style.display = isHidden ? "none" : "flex";
	});
}
