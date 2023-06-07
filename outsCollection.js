use("ipl");

const unwindInnings = { $unwind: "$innings" };
const unwindOvers = { $unwind: "$overs" };
const unwindDeliveries = { $unwind: "$overs.deliveries" };

// NOTE: this also works as a filter, it excludes the documents in which wickets=[]
const unwindWickets = { $unwind: "$overs.deliveries.wickets" };

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

const projectOuts = {
  $project: {
    matchID: { $toString: "$matchID" },
    season: 1,
    over: "$overs.over",
    ballNo: "$overs.deliveries.ballNo",
    innings: 1,
    bowler: "$overs.deliveries.bowler",
    playerOut: "$overs.deliveries.wickets.player_out",
    outType: "$overs.deliveries.wickets.kind",
    fieldersInvolved: "$overs.deliveries.wickets.fielders.name",
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

// Different types of outs given in the data:
// stumped, lbw, run out, caught, caught and bowled, bowled

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
  unwindWickets,
  projectOuts,
  setBowlerWicket,
  { $out: "outs" },
]);

// NOTE: added season column
