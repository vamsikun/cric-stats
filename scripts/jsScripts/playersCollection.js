use("ipl");

db.matches.aggregate([
  {
    $facet: {
      teamPlayer: [
        {
          $project: {
            players: { $objectToArray: "$info.players" },
            matchID: "$_id",
            toss: "$info.toss",
            _id: 0,
          },
        },
        { $unwind: "$players" },
        { $unwind: "$players.v" },
        {
          $project: {
            matchID: 1,
            toss: 1,
            team: "$players.k",
            player: "$players.v",
          },
        },
        {
          $set: {
            innings: {
              $cond: {
                if: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$team", "$toss.winner"] },
                        { $eq: ["$toss.decision", "field"] },
                      ],
                    },
                    {
                      $and: [
                        { $ne: ["$team", "$toss.winner"] },
                        { $eq: ["$toss.decision", "bat"] },
                      ],
                    },
                  ],
                },
                then: 2,
                else: 1,
              },
            },
          },
        },
      ],
      playerID: [
        {
          $project: {
            playerIDs: { $objectToArray: "$info.registry.people" },
            matchID: "$_id",
            _id: 0,
          },
        },
        { $unwind: "$playerIDs" },
        {
          $project: {
            matchID: 1,
            player: "$playerIDs.k",
            playerID: "$playerIDs.v",
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
      innings: "$teamPlayerIDs.innings",
    },
  },
  {
    $set: {
      team: {
        $switch: {
          branches: [
            {
              case: { $eq: ["$team", "Punjab Kings"] },
              then: "Kings XI Punjab",
            },
            {
              case: { $eq: ["$team", "Rising Pune Supergiant"] },
              then: "Rising Pune Supergiants",
            },
            {
              case: { $eq: ["$team", "Delhi Daredevils"] },
              then: "Delhi Capitals",
            },
            {
              case: { $eq: ["$team", "Pune Warriors"] },
              then: "Pune Warriors India",
            },
          ],
          default: "$team",
        },
      },
    },
  },
  {
    $group: {
      _id: { matchID: "$matchID", player: "$player" },
      team: { $addToSet: "$team" },
      playerID: { $addToSet: "$playerID" },
      innings: { $addToSet: "$innings" },
    },
  },
  {
    $unwind: {
      path: "$team",
    },
  },
  {
    $unwind: {
      path: "$innings",
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
      matchID: { $toString: "$_id.matchID" },
      player: "$_id.player",
      team: 1,
      playerID: 1,
      innings: 1,
      _id: 0,
    },
  },
  { $match: { $expr: { $ne: [{ $type: "$team" }, "missing"] } } },
  { $out: "players" },
  //TODO: Not working correctly check dhoni's and kohli's number
]);

// NOTE: using explain the query is taking around 220-250ms to execute
