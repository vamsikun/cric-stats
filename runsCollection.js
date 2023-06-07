use("ipl");

const unwindInnings = { $unwind: "$innings" };
const unwindOvers = { $unwind: "$overs" };
const unwindDeliveries = { $unwind: "$overs.deliveries" };

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

const projectDeliveries = {
  $project: {
    matchID: "$_id",
    overs: "$innings.overs",
    innings: {
      $cond: {
        if: { $eq: ["$innings.team", { $arrayElemAt: ["$info.teams", 0] }] },
        then: 1,
        else: 2,
      },
    },
    _id: 0,
    season: "$info.season",
    battingTeam: "$innings.team",
    bowlingTeam: {
      $cond: {
        if: { $eq: ["$innings.team", { $arrayElemAt: ["$info.teams", 0] }] },
        then: { $arrayElemAt: ["$info.teams", 1] },
        else: { $arrayElemAt: ["$info.teams", 0] },
      },
    },
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

const projectEachBall = {
  $project: {
    matchID: { $toString: "$matchID" },
    season: "$season",
    innings: "$innings",
    over: "$overs.over",
    battingTeam: "$battingTeam",
    bowlingTeam: "$bowlingTeam",
    ballNo: "$overs.deliveries.ballNo",
    batter: "$overs.deliveries.batter",
    nonStriker: "$overs.deliveries.non_striker",
    bowler: "$overs.deliveries.bowler",
    batterRuns: "$overs.deliveries.runs.batter",
    extraRuns: "$overs.deliveries.runs.extras",
    wicket: { $arrayElemAt: ["$overs.deliveries.wickets.player_out", 0] },
    wide: { $ifNull: ["$overs.deliveries.extras.wides", 0] },
    noball: { $ifNull: ["$overs.deliveries.extras.noballs", 0] },
    boundaries: boundariesCond,
  },
};

// TODO: this can be added as a global command
db.matches.updateMany({ "info.season": { $type: 16 } }, [
  { $set: { "info.season": { $toString: "$info.season" } } },
]);

db.matches.aggregate([
  projectInnings,
  unwindInnings,
  projectDeliveries,
  setBallNo,
  unwindOvers,
  unwindDeliveries,
  projectEachBall,
  { $out: "runs" },
]);

// NOTE: added bowling and batting team columns
