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
        then: "f",
        else: "t",
      },
    },
    _id: 0,
    season: "$info.season",
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
    ballNo: "$overs.deliveries.ballNo",
    batter: "$overs.deliveries.batter",
    nonStriker: "$overs.deliveries.non_striker",
    bowler: "$overs.deliveries.bowler",
    batterRuns: "$overs.deliveries.runs.batter",
    extraRuns: "$overs.deliveries.runs.extras",
    // wicket: { $arrayElemAt: ["$overs.deliveries.wickets.player_out", 0] },
    wicket: {
      $cond: {
        if: { $ne: ["$overs.deliveries.wickets.kind", ["retired hurt"]] },
        then: { $arrayElemAt: ["$overs.deliveries.wickets.player_out", 0] },
        else: null,
      },
    },
    outType: { $arrayElemAt: ["$overs.deliveries.wickets.kind", 0] },
    fieldersInvolved: {
      $arrayElemAt: ["$overs.deliveries.wickets.fielders.name", 0],
    },
    // wide: { $ifNull: ["$overs.deliveries.extras.wides", 0] },
    // noball: { $ifNull: ["$overs.deliveries.extras.noballs", 0] },
    // penalty: { $ifNull: ["$overs.deliveries.extras.penalty", 0] },
    wide: "$overs.deliveries.extras.wides",
    noball: "$overs.deliveries.extras.noballs",
    penalty: "$overs.deliveries.extras.penalty",
    boundaries: boundariesCond,
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

const setFieldersInvolved = {
  $set: {
    fieldersInvolved: {
      $cond: {
        if: {
          $and: [
            { $ne: [{ $type: "$fieldersInvolved" }, "missing"] },
            { $ne: ["$fieldersInvolved", null] },
            { $ne: [{ $size: "$fieldersInvolved" }, 0] },
          ],
        },
        then: {
          $cond: {
            if: { $eq: [{ $size: "$fieldersInvolved" }, 1] },
            then: { $arrayElemAt: ["$fieldersInvolved", 0] },
            else: {
              $reduce: {
                input: "$fieldersInvolved",
                initialValue: "",
                // TODO: + is being added as the first char
                in: { $concat: ["$$value", "+", "$$this"] },
              },
            },
          },
        },
        else: null,
      },
    },
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
  setBowlerWicket,
  setFieldersInvolved,
  // { $out: "runs" },
]);

// NOTE: added outs information