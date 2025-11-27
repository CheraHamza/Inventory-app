const { Router } = require("express");
const booksController = require("../controllers/booksController");

const booksRouter = Router();

booksRouter.get("/", booksController.getBooks);

booksRouter.get("/add", booksController.getAddBook);
booksRouter.post("/add", booksController.postAddBook);

booksRouter.get("/update/:id", booksController.getUpdateBook);
booksRouter.post("/update/:id", booksController.postUpdateBook);

booksRouter.post("/delete", booksController.postDeleteBook);

module.exports = booksRouter;
