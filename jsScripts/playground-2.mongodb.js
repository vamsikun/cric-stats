use("ipl");

const setMatchNumberAndDate = {
  $set: {
    matchNumber: {
      $cond: {
        if: { $eq: [{ $type: "$info.event.match_number" }, "missing"] },
        then: "$info.event.stage",
        else: "$info.event.match_number",
      },
    },
    matchStartDate: {
      $arrayElemAt: ["$info.dates", 0],
    },
  },
};

const setSuperOver = {
  $set: {
    isSuperOver: {
      $size: {
        $filter: {
          input: "$innings",
          as: "inning",
          cond: { $eq: ["$$inning.super_over", true] },
        },
      },
    },
  },
};
const setTeamScores = [
  {
    $set: {
      team1Innings: { $arrayElemAt: ["$innings", 0] },
      team2Innings: { $arrayElemAt: ["$innings", 1] },
    },
  },
  {
    $set: {
      team1Dels: {
        $map: {
          input: "$team1Innings.overs",
          as: "over",
          in: {
            $mergeObjects: [
              "$$over",
              {
                runs: { $sum: "$$over.deliveries.runs.total" },
                extras: { $sum: "$$over.deliveries.runs.extras" },
                wickets: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: { $gt: ["$$delivery.wickets", null] },
                    },
                  },
                },
                fours: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: {
                        $and: [
                          {
                            $eq: [
                              { $type: "$$delivery.runs.non_boundary" },
                              "missing",
                            ],
                          },
                          { $eq: ["$$delivery.runs.batter", 4] },
                        ],
                      },
                    },
                  },
                },
                sixes: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: {
                        $and: [
                          {
                            $eq: [
                              { $type: "$$delivery.runs.non_boundary" },
                              "missing",
                            ],
                          },
                          { $eq: ["$$delivery.runs.batter", 6] },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
      team2Dels: {
        $map: {
          input: "$team2Innings.overs",
          as: "over",
          in: {
            $mergeObjects: [
              "$$over",
              {
                runs: { $sum: "$$over.deliveries.runs.total" },
                extras: { $sum: "$$over.deliveries.runs.extras" },
                wickets: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: { $gt: ["$$delivery.wickets", null] },
                    },
                  },
                },
                fours: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: {
                        $and: [
                          {
                            $eq: [
                              { $type: "$$delivery.runs.non_boundary" },
                              "missing",
                            ],
                          },
                          { $eq: ["$$delivery.runs.batter", 4] },
                        ],
                      },
                    },
                  },
                },
                sixes: {
                  $size: {
                    $filter: {
                      input: "$$over.deliveries",
                      as: "delivery",
                      cond: {
                        $and: [
                          {
                            $eq: [
                              { $type: "$$delivery.runs.non_boundary" },
                              "missing",
                            ],
                          },
                          { $eq: ["$$delivery.runs.batter", 6] },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    $set: {
      team1Score: { $sum: "$team1Dels.runs" },
      team2Score: { $sum: "$team2Dels.runs" },
      team1Extras: { $sum: "$team1Dels.extras" },
      team2Extras: { $sum: "$team2Dels.extras" },
      team1Wickets: { $sum: "$team1Dels.wickets" },
      team2Wickets: { $sum: "$team2Dels.wickets" },
      team1Fours: { $sum: "$team1Dels.fours" },
      team1Sixes: { $sum: "$team1Dels.sixes" },
      team2Fours: { $sum: "$team2Dels.fours" },
      team2Sixes: { $sum: "$team2Dels.sixes" },
    },
  },
  {
    $unset: ["team2Innings", "team1Innings", "team1Dels", "team2Dels"],
  },
];

const projectMatches = {
  $project: {
    _id: 0,
    matchID: { $toString: "$_id" },
    matchNumber: 1,
    season: {
      $switch: {
        branches: [
          { case: { $eq: ["$info.season", "2009/10"] }, then: "2010" },
          { case: { $eq: ["$info.season", "2007/08"] }, then: "2008" },
          { case: { $eq: ["$info.season", "2020/21"] }, then: "2020" },
        ],
        default: "$info.season",
      },
    },
    matchStartDate: 1,
    city: "$info.city",
    tossWon: "$info.toss.winner",
    tossDecision: "$info.toss.decision",
    // batting first
    team1: { $arrayElemAt: ["$innings.team", 0] },
    // batting second
    team2: {
      $cond: {
        if: {
          $eq: [
            { $arrayElemAt: ["$innings.team", 0] },
            { $arrayElemAt: ["$info.teams", 0] },
          ],
        },
        then: { $arrayElemAt: ["$info.teams", 1] },
        else: { $arrayElemAt: ["$info.teams", 0] },
      },
    },
    teamWon: { $ifNull: ["$info.outcome.winner", "$info.outcome.eliminator"] },
    wonByWickets: "$info.outcome.by.wickets",
    wonByRuns: "$info.outcome.by.runs",
    team1Score: 1,
    team2Score: 1,
    team1Extras: 1,
    team2Extras: 1,
    team1Wickets: 1,
    team2Wickets: 1,
    team1Fours: 1,
    team1Sixes: 1,
    team2Fours: 1,
    team2Sixes: 1,
    playerOfMatch: { $arrayElemAt: ["$info.player_of_match", 0] },
    isSuperOver: 1,
  },
};

const renameTeams = {
  $set: {
    team1: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$team1", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$team1", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$team1", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$team1",
      },
    },
    team2: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$team2", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$team2", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$team2", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$team2",
      },
    },
    teamWon: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$teamWon", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$teamWon", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$teamWon", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$teamWon",
      },
    },
    tossWon: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$tossWon", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$tossWon", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$tossWon", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$tossWon",
      },
    },
  },
};

db.matches.aggregate([
  ...setTeamScores,
  setSuperOver,
  setMatchNumberAndDate,
  projectMatches,
  renameTeams,
  // { $out: "eachMatch" },
]);

// NOTE: using explain the query is taking 350-400ms to execute
