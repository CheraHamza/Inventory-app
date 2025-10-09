const { Router } = require("express");
const libraryController = require("../controllers/libraryController");
const libraryRouter = Router();

// root
libraryRouter.get("/", libraryController.getIndex);

// browse
libraryRouter.get("/browse", libraryController.getLibrary);
libraryRouter.get("/browse/category:name", libraryController.getCategory);
libraryRouter.get("/browse/author:id", libraryController.getAuthor);

// manage
libraryRouter.get("/manage", libraryController.getManagement);

// manage books
libraryRouter.get("/manage/books", libraryController.getBooksManagement);
libraryRouter.get("/manage/books/add", libraryController.addBookGet);
libraryRouter.get("/manage/books/update:id", libraryController.updateBookGet);

// manage authors
libraryRouter.get("/manage/authors", libraryController.getAuthorsManagement);
libraryRouter.get("/manage/authors/add", libraryController.addAuthorGet);
libraryRouter.get(
	"/manage/authors/update:id",
	libraryController.updateAuthorGet
);

// manage genres
libraryRouter.get("/manage/genres", libraryController.getGenresManagement);
libraryRouter.get("/manage/genres/add", libraryController.addGenreGet);
libraryRouter.get("/manage/genres/update:id", libraryController.updateGenreGet);

module.exports = libraryRouter;
