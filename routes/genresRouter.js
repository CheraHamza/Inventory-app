const { Router } = require("express");
const genresController = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresController.getGenres);

genresRouter.get("/add", genresController.getAddGenre);
genresRouter.post("/add", genresController.postAddGenre);

genresRouter.get("/update/:id", genresController.getUpdateGenre);
genresRouter.post("/update/:id", genresController.postUpdateGenre);

genresRouter.post("/delete", genresController.postDeleteGenre);

module.exports = genresRouter;
