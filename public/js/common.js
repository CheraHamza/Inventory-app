const cardElements = document.querySelectorAll(".card");

cardElements.forEach((card) => {
	card.addEventListener("click", () => {
		const detailsModal = document.querySelector(
			`dialog#id${card.id}.detailsModal`
		);
		const closeBtn = detailsModal.querySelector("button.close-btn");

		detailsModal.showModal();

		closeBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			detailsModal.scrollTop = 0;
			detailsModal.close();
		});
	});

	const updateBtn = card.querySelector("button.updateBtn");
	const deleteBtn = card.querySelector("button.deleteBtn");

	if (updateBtn) {
		updateBtn.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	}

	if (deleteBtn) {
		deleteBtn.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	}
});

const deleteBtns = document.querySelectorAll("button.deleteBtn");

if (deleteBtns) {
	deleteBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const targetId = e.target.getAttribute("data-id");

			const confirmModal = document.querySelector(
				`dialog#id${targetId}.confirmModal`
			);
			confirmModal.showModal();

			const cancelBtn = confirmModal.querySelector(".cancel-btn");

			confirmModal.addEventListener("click", (e) => {
				e.stopPropagation();
			});

			cancelBtn.addEventListener("click", (e) => {
				confirmModal.close();
			});
		});
	});
}
