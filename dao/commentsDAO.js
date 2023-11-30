//Mizan Modak, 11/13/2023, IT302-001, Unit 9 Assignment , mm355@njit.edu

import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let comments;
export default class CommentsDAO {
  static async injectDB(conn) {
    if (comments) {
      return;
    }
    try {
      comments = await conn.db(process.env.FREEGAMES_NS).collection("comments");
    } catch (e) {
      console.error(
        `unable to establish connection handle in commentsDAO: ${e}`
      );
    }
  }
  static async addComments(gameId, user, comment, date) {
    try {
      const commentDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        comment: comment,
        game_id: new ObjectId(gameId),
      };
      return await comments.insertOne(commentDoc);
    } catch (e) {
      console.error(`unable to post comments: ${e}`);
      console.error(e);
      return { error: e };
    }
  }

  static async updateComments(commentId, userId, comment, date) {
    try {
      const updateResponse = await comments.updateOne(
        { user_id: userId, _id: new ObjectId(commentId) },
        { $set: { comment: comment, date: date } }
      );
      return updateResponse;
    } catch (e) {
      console.error(`unable to update comments: ${e}`);
      console.error(e);
      return { error: e };
    }
  }

  static async deleteComments(commentId, userId) {
    try {
      const deleteResponse = await comments.deleteOne({
        _id: new ObjectId(commentId),
        user_id: userId,
      });
      return deleteResponse;
    } catch (e) {
      console.error(`unable to delete comments: ${e}`);
      console.error(e);
      return { error: e.message };
    }
  }
}
