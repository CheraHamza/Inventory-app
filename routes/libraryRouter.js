const { Router } = require("express");
const libraryController = require("../controllers/libraryController");
const libraryRouter = Router();

libraryRouter.get("/", libraryController.getIndex);

module.exports = libraryRouter;
