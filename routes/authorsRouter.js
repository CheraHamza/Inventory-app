const { Router } = require("express");
const authorsController = require("../controllers/authorsController");

const authorsRouter = Router();

authorsRouter.get("/", authorsController.getAuthors);

authorsRouter.get("/add", authorsController.getAddAuthor);
authorsRouter.post("/add", authorsController.postAddAuthor);

authorsRouter.get("/update/:id", authorsController.getUpdateAuthor);
authorsRouter.post("/update/:id", authorsController.postUpdateAuthor);

authorsRouter.post("/delete", authorsController.postDeleteAuthor);

module.exports = authorsRouter;
