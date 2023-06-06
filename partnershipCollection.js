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
    innings: {
      $cond: {
        if: { $eq: ["$innings.team", { $arrayElemAt: ["$info.teams", 0] }] },
        then: 1,
        else: 2,
      },
    },
    _id: 0,
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

const unwindOvers = { $unwind: "$overs" };

const unwindDeliveries = { $unwind: "$overs.deliveries" };

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
    wicket: {
      $cond: {
        if: {
          $gt: ["$overs.deliveries.wickets", null],
        },
        then: 1,
        else: 0,
      },
    },
    boundaries: boundariesCond,
  },
};

const setPartnersAndBallsFaced = {
  $set: {
    batsmen: {
      $sortArray: {
        input: ["$batter", "$nonStriker"],
        sortBy: 1,
      },
    },
    ballsFaced: {
      $cond: {
        if: {
          $eq: ["$wide", 0],
        },
        then: 1,
        else: 0,
      },
    },
  },
};

const groupPartnersAndBallsFaced = {
  $group: {
    _id: {
      matchID: "$matchID",
      innings: "$innings",
      batsmen: "$batsmen",
    },
    partnership: {
      $sum: { $add: ["$batterRuns", "$extraRuns"] },
    },
    wicket: {
      $sum: "$wicket",
    },
    ballsFaced: {
      $sum: "$ballsFaced",
    },
    fours: {
      $sum: {
        $cond: [{ $eq: ["$boundaries", 4] }, 1, 0],
      },
    },
    sixes: {
      $sum: {
        $cond: [{ $eq: ["$boundaries", 6] }, 1, 0],
      },
    },
  },
};

const groupPartnerWithBatter = {
  $group: {
    _id: {
      matchID: "$matchID",
      innings: "$innings",
      batsmen: "$batsmen",
      batter: "$batter",
    },
    batterRuns: {
      $sum: "$batterRuns",
    },
    ballsFaced: {
      $sum: "$ballsFaced",
    },
    batterFours: {
      $sum: {
        $cond: [{ $eq: ["$boundaries", 4] }, 1, 0],
      },
    },
    batterSixes: {
      $sum: {
        $cond: [{ $eq: ["$boundaries", 6] }, 1, 0],
      },
    },
  },
};

const setFirstAndSecondBatter = {
  $set: {
    firstBatter: { $arrayElemAt: ["$_id.batsmen", 0] },
    secondBatter: { $arrayElemAt: ["$_id.batsmen", 1] },
  },
};

const getFirstAndSecondBatterRuns = [
  {
    $facet: {
      firstBatterRuns: [
        {
          $match: {
            $expr: {
              $eq: ["$firstBatter", "$_id.batter"],
            },
          },
        },
        {
          $set: {
            batter1Runs: "$batterRuns",
            batter1BallsFaced: "$ballsFaced",
            batter1Fours: "$batterFours",
            batter1Sixes: "$batterSixes",
          },
        },
      ],
      secondBatterRuns: [
        {
          $match: {
            $expr: {
              $eq: ["$secondBatter", "$_id.batter"],
            },
          },
        },
        {
          $set: {
            batter2Runs: "$batterRuns",
            batter2BallsFaced: "$ballsFaced",
            batter2Fours: "$batterFours",
            batter2Sixes: "$batterSixes",
          },
        },
      ],
    },
  },
  {
    $project: {
      activity: {
        $setUnion: ["$firstBatterRuns", "$secondBatterRuns"],
      },
    },
  },
  { $unwind: "$activity" },
  { $unset: "activity._id.batter" },
  {
    $group: {
      _id: "$activity._id",
      firstBatterRuns: { $sum: "$activity.batter1Runs" },
      secondBatterRuns: { $sum: "$activity.batter2Runs" },
      firstBatterBallsFaced: { $sum: "$activity.batter1BallsFaced" },
      secondBatterBallsFaced: { $sum: "$activity.batter2BallsFaced" },
      firstBatterFours: { $sum: "$activity.batter1Fours" },
      firstBatterSixes: { $sum: "$activity.batter1Sixes" },
      secondBatterFours: { $sum: "$activity.batter2Fours" },
      secondBatterSixes: { $sum: "$activity.batter2Sixes" },
    },
  },
];

//------------ Creates Partnership Collection -----------------//

db.matches.aggregate([
  projectInnings,
  unwindInnings,
  projectDeliveries,
  setBallNo,
  unwindOvers,
  unwindDeliveries,
  projectEachBall,
  setPartnersAndBallsFaced,
  groupPartnersAndBallsFaced,
  {
    $sort: {
      partnership: -1,
    },
  },
  { $out: "partnershipData" },
]);

db.matches.aggregate([
  projectInnings,
  unwindInnings,
  projectDeliveries,
  setBallNo,
  unwindOvers,
  unwindDeliveries,
  projectEachBall,
  setPartnersAndBallsFaced,
  groupPartnerWithBatter,
  setFirstAndSecondBatter,
  ...getFirstAndSecondBatterRuns,
  {
    $sort: {
      firstBatterRuns: -1,
    },
  },
  { $out: "individualPartershipData" },
]);

db.partnershipData.aggregate([
  {
    $lookup: {
      from: "individualPartershipData",
      localField: "_id",
      foreignField: "_id",
      as: "individualPartnershipData",
    },
  },
  { $unwind: "$individualPartnershipData" },
  {
    $project: {
      _id: 0,
      matchID: "$_id.matchID",
      innings: "$_id.innings",
      firstBatter: { $arrayElemAt: ["$_id.batsmen", 0] },
      secondBatter: { $arrayElemAt: ["$_id.batsmen", 1] },
      firstBatterRuns: "$individualPartnershipData.firstBatterRuns",
      secondBatterRuns: "$individualPartnershipData.secondBatterRuns",
      firstBatterBallsFaced: "$individualPartnershipData.firstBatterBallsFaced",
      secondBatterBallsFaced:
        "$individualPartnershipData.secondBatterBallsFaced",
      parternship: "$partnership",
      totalBallsFaced: "$ballsFaced",
      wicket: "$wicket",
      fours: "$fours",
      sixes: "$sixes",
      firstBatterFours: "$individualPartnershipData.firstBatterFours",
      firstBatterSixes: "$individualPartnershipData.firstBatterSixes",
      secondBatterFours: "$individualPartnershipData.secondBatterFours",
      secondBatterSixes: "$individualPartnershipData.secondBatterSixes",
    },
  },
  { $out: "partnerships" },
]);

db.partnershipData.drop();
db.individualPartershipData.drop();
