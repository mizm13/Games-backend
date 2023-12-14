
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let games;

export default class GamesDAO {
  static async injectDB(conn) {
    if (games) {
      return;
    }
    try {
      games = await conn.db(process.env.FREEGAMES_NS).collection("games_mm355");
    } catch (e) {
      console.error(`Unable to connect in GamesDAO: ${e}`);
    }
  }

  static async getGames({
    filters = null,
    pageNumber = 0,
    itemsPerPage = 20,
  } = {}) {
    let query = {}; // Initialize the query object

    if (filters) {
      if ("title" in filters) {
        //console.log("test1");
        console.log(filters, "test");
        query = { $text: { $search: filters["title"] } };
        console.log(query);
      } else if ("genre" in filters) {
        query = { genre: { $eq: filters["genre"] } };
      }
    }

    let cursor;
    try {
      cursor = await games
        .find(query)
        .limit(itemsPerPage)
        .skip(itemsPerPage * pageNumber);

      const gamesList = await cursor.toArray();
      const totalNumGames = await games.countDocuments(query);

      return { gamesList, totalNumGames };
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      console.error(e);
      return { gamesList: [], totalNumGames: 0 };
    }
  }

  static async getGameById(id) {
    try {
      return await games
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "game_id",
              as: "comments",
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getGameById: ${e}`);
      throw e;
    }
  }

  static async getGenres() {
    let genres = [];
    try {
      genres = await games.distinct("genre");
      return genres;
    } catch (e) {
      console.error(`unable to get genres, $(e)`);
      return genres;
    }
  }
}
