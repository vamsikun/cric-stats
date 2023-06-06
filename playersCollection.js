use("ipl");

db.matches.aggregate([
  {
    $facet: {
      teamPlayer: [
        {
          $project: {
            players: { $objectToArray: "$info.players" },
            matchID: "$_id",
            season: "$info.season",
            _id: 0,
          },
        },
        { $unwind: "$players" },
        { $unwind: "$players.v" },
        {
          $project: {
            matchID: 1,
            season: 1,
            teams: 1,
            date: 1,
            team: "$players.k",
            player: "$players.v",
          },
        },
      ],
      playerID: [
        {
          $project: {
            playerIDs: { $objectToArray: "$info.registry.people" },
            matchID: "$_id",
            season: "$info.season",
            _id: 0,
          },
        },
        { $unwind: "$playerIDs" },
        {
          $project: {
            matchID: 1,
            player: "$playerIDs.k",
            playerID: "$playerIDs.v",
            season: 1,
            teams: 1,
            date: 1,
          },
        },
      ],
    },
  },
  {
    $project: {
      teamPlayerIDs: { $setUnion: ["$teamPlayer", "$playerID"] },
    },
  },
  { $unwind: "$teamPlayerIDs" },
  {
    $project: {
      matchID: "$teamPlayerIDs.matchID",
      team: "$teamPlayerIDs.team",
      player: "$teamPlayerIDs.player",
      playerID: "$teamPlayerIDs.playerID",
    },
  },
  {
    $group: {
      _id: { matchID: "$matchID", player: "$player" },
      team: { $addToSet: "$team" },
      playerID: { $addToSet: "$playerID" },
    },
  },
  {
    $unwind: {
      path: "$team",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: "$playerID",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      matchID: "$_id.matchID",
      player: "$_id.player",
      team: 1,
      playerID: 1,
      _id: 0,
    },
  },
  { $match: { $expr: { $ne: [{ $type: "$team" }, "missing"] } } },
  { $out: "players" },
  // { $match: { "_id.player": "S Dhawan", "_id.season": "2009/10" } },
  //TODO: Not working correctly check dhoni's and kohli's number
]);
