
import express from "express";
import GamesController from "./games.controller.js";
import CommentsController from "./comments.controller.js";

const router = express.Router();

//router.route('/').get((req,res) => { res.status(200); res.send('hello world'); });

router.route("/id/:id").get(GamesController.apiGetGameById);

router.route("/genres").get(GamesController.apiGetGenres);

// route to games.controller class
router.route("/").get(GamesController.apiGetGames);

// route to comments.controller class
router
  .route("/comment")
  .post(CommentsController.apiPostComments)
  .put(CommentsController.apiUpdateComments)
  .delete(CommentsController.apiDeleteComments);

export default router;
