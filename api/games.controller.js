//Mizan Modak, 11/13/2023, IT302-001, Unit 9 Assignment , mm355@njit.edu

import GamesDAO from "../dao/gamesDAO.js";

export default class GamesController {
  static async apiGetGames(req, res, next) {
    const itemsPerPage = req.query.itemsPerPage
      ? parseInt(req.query.itemsPerPage)
      : 20;
    console.log(itemsPerPage);
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber)
      : 0;
    let filters = {};
    if (req.query.genre) {
      filters.genre = req.query.genre;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }
    const { gamesList, totalNumGames } = await GamesDAO.getGames({
      filters,
      pageNumber,
      itemsPerPage,
    });

    let response = {
      games: gamesList,
      items_per_page: itemsPerPage,
      pageNumber: pageNumber,
      filters: filters,
      total_results: totalNumGames,
    };
    res.json(response);
  }

  static async apiGetGameById(req, res, next) {
    try {
      let id = req.params.id || {};
      let game = await GamesDAO.getGameById(id);
      if (!game) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(game);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
  static async apiGetGenres(req, res, next) {
    try {
      let propertyTypes = await GamesDAO.getGenres();
      res.json(propertyTypes);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
