
import CommentsDAO from "../dao/commentsDAO.js";

export default class CommentsController {
  static async apiPostComments(req, res, next) {
    console.log("I am in post comment");
    try {
      const gamesId = req.body.game_id;
      const text = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();
      console.log("I am in post comment 1");
      console.log(text);

      const CommentResponse = await CommentsDAO.addComments(
        gamesId,
        userInfo,
        text,
        date
      );
      console.log("I am in post comment 2");

      res.json(CommentResponse);
    } catch (e) {
      res.status(500).json({ error: e.message });

      console.log("I am in post comment 4");
    }
  }

  static async apiUpdateComments(req, res, next) {
    try {
      const commentId = req.body.comment_id;
      const text = req.body.text;
      const date = new Date();
      const CommentResponse = await CommentsDAO.updateComments(
        commentId,
        req.body.user_id,
        text,
        date
      );

      var { error } = CommentResponse;
      if (error) {
        res.status.json({ error });
      }
      if (CommentResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update comment. User may not be original poster"
        );
      }
      res.json(CommentResponse);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteComments(req, res, next) {
    try {
      const commentId = req.body.comment_id;
      const userId = req.body.user_id;
      const CommentResponse = await CommentsDAO.deleteComments(
        commentId,
        userId
      );
      res.json(CommentResponse);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
