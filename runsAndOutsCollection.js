use("ipl");
const projectInnings = {
  $project: {
    innings: {
      $filter: {
        input: "$innings",
        as: "innings",
        cond: { $eq: [{ $type: "$$innings.super_over" }, "missing"] },
      },
    },
    _id: 1,
    info: 1,
  },
};

const unwindInnings = { $unwind: "$innings" };

const projectDeliveries = {
  $project: {
    matchID: "$_id",
    overs: "$innings.overs",
    // battingTeam: "$innings.team",
    // bowlingTeam: {
    //   $cond: {
    //     if: { $eq: ["$innings.team", { $arrayElemAt: ["$info.teams", 0] }] },
    //     then: { $arrayElemAt: ["$info.teams", 1] },
    //     else: { $arrayElemAt: ["$info.teams", 0] },
    //   },
    // },
    innings: {
      $cond: {
        if: { $eq: ["$innings.team", { $arrayElemAt: ["$info.teams", 0] }] },
        then: 1,
        else: 2,
      },
    },
    // season: "$info.season",
    _id: 0,
  },
};

const boundariesCond = {
  $cond: {
    if: {
      $and: [
        {
          $eq: [{ $type: "$overs.deliveries.runs.non_boundary" }, "missing"],
        },
        {
          $or: [
            { $eq: ["$overs.deliveries.runs.batter", 4] },
            { $eq: ["$overs.deliveries.runs.batter", 6] },
          ],
        },
      ],
    },
    then: "$overs.deliveries.runs.batter",
    else: 0,
  },
};

const unwindOvers = { $unwind: "$overs" };

const setBallNo = {
  $set: {
    overs: {
      $map: {
        input: "$overs",
        as: "over",
        in: {
          $mergeObjects: [
            "$$over",
            {
              deliveries: {
                $map: {
                  input: {
                    $range: [0, { $size: "$$over.deliveries" }],
                  },
                  as: "deliveryIdx",
                  in: {
                    $mergeObjects: [
                      {
                        $arrayElemAt: ["$$over.deliveries", "$$deliveryIdx"],
                      },
                      { ballNo: { $add: ["$$deliveryIdx", 1] } },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
};

const unwindDeliveries = { $unwind: "$overs.deliveries" };

const renameTeams = {
  $set: {
    battingTeam: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$battingTeam", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$battingTeam", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$battingTeam", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$battingTeam",
      },
    },
    bowlingTeam: {
      $switch: {
        branches: [
          {
            case: { $eq: ["$bowlingTeam", "Punjab Kings"] },
            then: "Kings XI Punjab",
          },
          {
            case: { $eq: ["$bowlingTeam", "Rising Pune Supergiant"] },
            then: "Rising Pune Supergiants",
          },
          {
            case: { $eq: ["$bowlingTeam", "Delhi Daredevils"] },
            then: "Delhi Capitals",
          },
        ],
        default: "$bowlingTeam",
      },
    },
  },
};

const unwindWickets = { $unwind: "$overs.deliveries.wickets" };
// NOTE: preserving null arrays is important here
const unwindFielders = {
  $unwind: {
    path: "$overs.deliveries.wickets.fielders",
    preserveNullAndEmptyArrays: true,
  },
};

const sortSeason = {
  $sort: {
    season: -1,
  },
};

const projectEachBall = {
  $project: {
    matchID: "$matchID",
    innings: "$innings",
    over: "$overs.over",
    ballNo: "$overs.deliveries.ballNo",
    batter: "$overs.deliveries.batter",
    nonStriker: "$overs.deliveries.non_striker",
    bowler: "$overs.deliveries.bowler",
    batterRuns: "$overs.deliveries.runs.batter",
    extraRuns: "$overs.deliveries.runs.extras",
    wide: { $ifNull: ["$overs.deliveries.extras.wides", 0] },
    noball: { $ifNull: ["$overs.deliveries.extras.noballs", 0] },
    boundaries: boundariesCond,
  },
};
const projectOuts = {
  $project: {
    matchID: 1,
    over: "$overs.over",
    ballNo: "$overs.deliveries.ballNo",
    innings: 1,
    bowler: "$overs.deliveries.bowler",
    playerOut: "$overs.deliveries.wickets.player_out",
    outType: "$overs.deliveries.wickets.kind",
    fielderInvolved: "$overs.deliveries.wickets.fielders.name",
  },
};

const setBowlerWicket = {
  $set: {
    bowlerWicket: {
      $cond: {
        if: {
          $or: [
            { $eq: ["$outType", "caught"] },
            { $eq: ["$outType", "caught and bowled"] },
            { $eq: ["$outType", "bowled"] },
            { $eq: ["$outType", "lbw"] },
            { $eq: ["$outType", "stumped"] },
          ],
        },
        then: 1,
        else: 0,
      },
    },
  },
};

db.matches.aggregate([
  projectInnings,
  unwindInnings,
  projectDeliveries,
  setBallNo,
  unwindOvers,
  unwindDeliveries,
  projectEachBall,
  sortSeason,
  renameTeams,
  { $out: "runs" },
]);

// db.matches.find();

// Different types of outs given in the data:
// stumped, lbw, run out, caught, caught and bowled, bowled

db.matches.aggregate([
  projectInnings,
  unwindInnings,
  projectDeliveries,
  setBallNo,
  unwindOvers,
  unwindDeliveries,
  {
    $match: {
      "overs.deliveries.wickets": { $ne: null },
    },
  },
  unwindWickets,
  unwindFielders,
  projectOuts,
  setBowlerWicket,
  renameTeams,
  { $out: "outs" },
]);
