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
    DLS: {
      // when the match started by thinking of the default number of overs
      // but had to change the number of overs in between
      $cond: {
        if: {$eq: ["$info.outcome.method", "D/L"]},
        then: 1,
        else: 0,
      }
    },
    oversReduced: {
      // when the overs are reduced before even the match starts
      // here I am assuming that whenever the target overs<20 
      // and match is not D/L then the overs has to be reduced 
      // before the match starting time
      $cond: {
        if: {$and: [
          {$ne: ["$info.outcome.method","D/L"]},
          {$ne: [{$arrayElemAt:["$innings.target.overs",0]},20]}
        ]},
        then: 1,
        else: 0,
      }
    }
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
                // TODO: didn't work with $add and providing minus sign to $size
                legal_deliveries: {$subtract: [{$size: "$$over.deliveries"},{$size: {
                  $filter: {
                    input: "$$over.deliveries.extras",
                    as: "extra",
                    cond: {$or: [{$ne: [{$type: "$$extra.wides"}, "missing"]}, {$ne: [{$type: "$$extra.noballs"}, "missing"]}]}
                  }
                }}]},
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
                legal_deliveries: {$subtract: [{$size: "$$over.deliveries"},{$size: {
                  $filter: {
                    input: "$$over.deliveries.extras",
                    as: "extra",
                    cond: {$or: [{$ne: [{$type: "$$extra.wides"}, "missing"]}, {$ne: [{$type: "$$extra.noballs"}, "missing"]}]}
                  }
                }}]},
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
      team2Fours: { $sum: "$team2Dels.fours" },
      team1Sixes: { $sum: "$team1Dels.sixes" },
      team2Sixes: { $sum: "$team2Dels.sixes" },
      team1LegalDeliveriesFaced: {$sum: "$team1Dels.legal_deliveries"},
      team2LegalDeliveriesFaced: {$sum: "$team2Dels.legal_deliveries"},

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
    team2Fours: 1,
    team1Sixes: 1,
    team2Sixes: 1,
    team1LegalDeliveriesFaced: 1,
    team2LegalDeliveriesFaced:1,
    playerOfMatch: { $arrayElemAt: ["$info.player_of_match", 0] },
    isSuperOver: 1,
    DLS:1,
    oversReduced:1,
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
          {
            case: { $eq: ["$team1", "Pune Warriors"] },
            then: "Pune Warriors India",
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
          {
            case: { $eq: ["$team2", "Pune Warriors"] },
            then: "Pune Warriors India",
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
          {
            case: { $eq: ["$teamWon", "Pune Warriors"] },
            then: "Pune Warriors India",
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
          {
            case: { $eq: ["$tossWon", "Pune Warriors"] },
            then: "Pune Warriors India",
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