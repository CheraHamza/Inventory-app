// handle authors

const addExistingAuthorBtns = document.querySelectorAll(
	".add-existing-author-btn"
);

const selectedAuthorsNames = document.querySelector("#selected_authors_names");
const selectedAuthorsContainer = document.querySelector(".selected-authors");

const selectedAuthorsBtns = document.querySelectorAll(".selected-author-btn");

if (selectedAuthorsBtns.length > 0) {
	selectedAuthorsBtns.forEach((selectedAuthorBtn) => {
		const authorName = selectedAuthorBtn.getAttribute("data-authorName");

		if (selectedAuthorsNames.value === "") {
			selectedAuthorsNames.value = authorName;
		} else {
			selectedAuthorsNames.value += `, ${authorName}`;
		}

		const existingAuthorBtn = document.querySelector(
			`.add-existing-author-btn[data-authorName="${selectedAuthorBtn.getAttribute(
				"data-authorName"
			)}"]`
		);

		existingAuthorBtn.hidden = true;
		selectedAuthorBtn.addEventListener("click", () => {
			existingAuthorBtn.hidden = false;

			const authorsNamesArray = selectedAuthorsNames.value.split(", ");
			selectedAuthorsNames.value = authorsNamesArray
				.filter(
					(name) => name !== selectedAuthorBtn.getAttribute("data-authorName")
				)
				.join(", ");

			console.log(selectedAuthorsNames.value);

			selectedAuthorBtn.remove();
		});
	});
}
// adding from existing authors

addExistingAuthorBtns.forEach((existingAuthorBtn) => {
	existingAuthorBtn.addEventListener("click", () => {
		existingAuthorBtn.hidden = true;

		const authorName = existingAuthorBtn.getAttribute("data-authorName");

		if (selectedAuthorsNames.value === "") {
			selectedAuthorsNames.value = authorName;
		} else {
			selectedAuthorsNames.value += `, ${authorName}`;
		}

		const selectedAuthorBtn = document.createElement("button");
		selectedAuthorBtn.type = "button";
		selectedAuthorBtn.textContent = authorName;
		selectedAuthorBtn.setAttribute("data-authorName", authorName);
		selectedAuthorBtn.classList.add("selected-author-btn");

		selectedAuthorBtn.addEventListener("click", () => {
			existingAuthorBtn.hidden = false;

			const authorsNamesArray = selectedAuthorsNames.value.split(", ");
			selectedAuthorsNames.value = authorsNamesArray
				.filter(
					(name) => name !== selectedAuthorBtn.getAttribute("data-authorName")
				)
				.join(", ");

			selectedAuthorBtn.remove();
		});

		selectedAuthorsContainer.insertBefore(
			selectedAuthorBtn,
			selectedAuthorsContainer.firstChild
		);
	});
});

// creating and adding new authors

const newAuthorBtn = document.querySelector(".new-author-btn");
const newAuthorInput = document.querySelector("#new_author_input");
const newAuthorErrors = document.querySelector(".new-author-errors");

newAuthorBtn.addEventListener("click", (e) => {
	e.target.hidden = true;
	newAuthorInput.type = "text";
	newAuthorInput.focus();
});

const existingAuthors = Array.from(addExistingAuthorBtns).map((btn) =>
	btn.getAttribute("data-authorName").toLowerCase()
);

function validateAddedAuthor(authorName) {
	const lengthError = `Author's name must contain between 3 and 200 characters.`;
	const formatError = `Author's name must only contain alphabetic characters.`;
	const redundenceError = `Author's name already exists, you can select it from the listed authors above.`;

	const activeErrors = [];

	if (authorName.length < 3 || authorName > 200) {
		activeErrors.push(lengthError);
	}
	if (!/^[A-Za-z ]+$/.test(authorName)) {
		activeErrors.push(formatError);
	}
	if (existingAuthors.includes(authorName)) {
		activeErrors.push(redundenceError);
	}

	return activeErrors;
}

newAuthorInput.addEventListener("keydown", (e) => {
	newAuthorErrors.replaceChildren();
	if (e.key == "Enter") {
		e.preventDefault();

		const errors = validateAddedAuthor(
			newAuthorInput.value.trim().toLowerCase()
		);

		if (errors.length > 0) {
			errors.forEach((error) => {
				const errorElement = document.createElement("li");
				errorElement.textContent = error;
				errorElement.classList.add("new-author-error");
				newAuthorErrors.appendChild(errorElement);
			});
		} else {
			if (selectedAuthorsNames.value === "") {
				selectedAuthorsNames.value = newAuthorInput.value;
			} else {
				selectedAuthorsNames.value += `, ${newAuthorInput.value}`;
			}

			const addedAuthor = document.createElement("button");
			addedAuthor.type = "button";
			addedAuthor.classList.add("added-author");
			addedAuthor.textContent = newAuthorInput.value;
			addedAuthor.setAttribute("data-authorName", newAuthorInput.value);

			addedAuthor.addEventListener("click", () => {
				const newAuthorsNames = selectedAuthorsNames.value.split(", ");
				selectedAuthorsNames.value = newAuthorsNames
					.filter(
						(authorName) =>
							authorName !== addedAuthor.getAttribute("data-authorName")
					)
					.join(", ");

				addedAuthor.remove();
			});

			selectedAuthorsContainer.insertBefore(
				addedAuthor,
				selectedAuthorsContainer.firstChild
			);

			newAuthorInput.value = "";
			newAuthorInput.type = "hidden";
			newAuthorBtn.hidden = false;
		}
	}

	if (e.key === "Escape") {
		newAuthorInput.value = "";
		newAuthorInput.type = "hidden";
		newAuthorBtn.hidden = false;
	}
});

// Handle genres

const addExistingGenresBtns = document.querySelectorAll(
	".add-existing-genre-btn"
);
const selectedGenresContainer = document.querySelector(".selected-genres");
const selectedGenresNames = document.querySelector("#selected_genres_names");

const selectedGenresBtns = document.querySelectorAll(".selected-genre-btn");

if (selectedGenresBtns.length > 0) {
	selectedGenresBtns.forEach((selectedGenreBtn) => {
		const genreName = selectedGenreBtn.getAttribute("data-genreName");

		if (selectedGenresNames.value === "") {
			selectedGenresNames.value = genreName;
		} else {
			selectedGenresNames.value += `, ${genreName}`;
		}

		const existingGenreBtn = document.querySelector(
			`.add-existing-genre-btn[data-genreName="${selectedGenreBtn.getAttribute(
				"data-genreName"
			)}"]`
		);

		existingGenreBtn.hidden = true;
		selectedGenreBtn.addEventListener("click", () => {
			existingGenreBtn.hidden = false;

			const genresNamesArray = selectedGenresNames.value.split(", ");
			selectedGenresNames.value = genresNamesArray
				.filter(
					(name) => name !== selectedGenreBtn.getAttribute("data-genreName")
				)
				.join(", ");

			selectedGenreBtn.remove();
		});
	});
}

// adding from existing genres

addExistingGenresBtns.forEach((existingGenreBtn) => {
	existingGenreBtn.addEventListener("click", () => {
		existingGenreBtn.hidden = true;

		const genreName = existingGenreBtn.getAttribute("data-genreName");

		if (selectedGenresNames.value === "") {
			selectedGenresNames.value = genreName;
		} else {
			selectedGenresNames.value += `, ${genreName}`;
		}

		const selectedGenreBtn = document.createElement("button");
		selectedGenreBtn.type = "button";
		selectedGenreBtn.textContent = genreName;
		selectedGenreBtn.setAttribute("data-genreName", genreName);
		selectedGenreBtn.classList.add("selected-genre-btn");

		selectedGenreBtn.addEventListener("click", () => {
			existingGenreBtn.hidden = false;

			const genresNamesArray = selectedGenresNames.value.split(", ");
			selectedGenresNames.value = genresNamesArray
				.filter(
					(name) => name !== selectedGenreBtn.getAttribute("data-genreName")
				)
				.join(", ");
			selectedGenreBtn.remove();
		});

		selectedGenresContainer.insertBefore(
			selectedGenreBtn,
			selectedGenresContainer.firstChild
		);
	});
});

// creating and adding new genres

const newGenreBtn = document.querySelector(".new-genre-btn");
const newGenreInput = document.querySelector("#new_genre_input");
const newGenreErrors = document.querySelector(".new-genre-errors");

newGenreBtn.addEventListener("click", () => {
	newGenreBtn.hidden = true;
	newGenreInput.type = "text";
	newGenreInput.focus();
});

const existingGenres = Array.from(addExistingGenresBtns).map((btn) =>
	btn.getAttribute("data-genreName").toLowerCase()
);

function validateAddedGenre(genreName) {
	const lengthError = `Genre's name must contain between 3 and 200 characters.`;
	const formatError = `Genre's name must only contain alphanumeric characters.`;
	const redundenceError = `Genre's name already exists, you can select it from the listed genres above.`;

	const activeErrors = [];

	if (genreName.length < 3 || genreName > 200) {
		activeErrors.push(lengthError);
	}
	if (!/^[A-Za-z0-9 ]+$/.test(genreName)) {
		activeErrors.push(formatError);
	}
	if (existingGenres.includes(genreName)) {
		activeErrors.push(redundenceError);
	}

	return activeErrors;
}

newGenreInput.addEventListener("keydown", (e) => {
	newGenreErrors.replaceChildren();
	if (e.key === "Enter") {
		e.preventDefault();

		const errors = validateAddedGenre(newGenreInput.value.trim().toLowerCase());

		if (errors.length > 0) {
			errors.forEach((error) => {
				const errorElement = document.createElement("li");
				errorElement.textContent = error;
				errorElement.classList.add("new-genre-error");
				newGenreErrors.appendChild(errorElement);
			});
		} else {
			if (selectedGenresNames.value === "") {
				selectedGenresNames.value = newGenreInput.value;
			} else {
				selectedGenresNames.value += `, ${newGenreInput.value}`;
			}

			const addedGenre = document.createElement("button");
			addedGenre.type = "button";
			addedGenre.classList.add("added-genre");
			addedGenre.textContent = newGenreInput.value;
			addedGenre.setAttribute("data-genreName", newGenreInput.value);

			addedGenre.addEventListener("click", () => {
				const newGenresNames = selectedGenresNames.value.split(", ");
				selectedGenresNames.value = newGenresNames
					.filter(
						(genreName) =>
							genreName !== addedGenre.getAttribute("data-genreName")
					)
					.join(", ");

				addedGenre.remove();
			});

			selectedGenresContainer.insertBefore(
				addedGenre,
				selectedGenresContainer.firstChild
			);

			newGenreInput.value = "";
			newGenreInput.type = "hidden";
			newGenreBtn.hidden = false;
		}
	}

	if (e.key === "Escape") {
		newGenreInput.value = "";
		newGenreInput.type = "hidden";
		newGenreBtn.hidden = false;
	}
});
