/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("ipl");

db.matches.updateMany({ "info.season": { $type: 16 } }, [
  { $set: { "info.season": { $toString: "$info.season" } } },
]);

// db.matches.aggregate([
//   {$match: {
//     _id:"6464f7b0dfd4c66ea8f58933"
//   }}])

// db.matches.findOne();
//
// //  runs scored by a batter
// db.matches.aggregate([
//   // {$match: {
//   //   _id:ObjectId("6464f7b0dfd4c66ea8f58933")
//   // }},
//   {
//     $project: {
//       deliveries: "$innings.overs.deliveries",
//     },
//   },
//   { $unwind: "$deliveries" },
//   { $unwind: "$deliveries" },
//   { $unwind: "$deliveries" },
//   {
//     $group: {
//       _id: "$deliveries.batter",
//       runs: { $sum: "$deliveries.runs.batter" },
//     },
//   },
//   {
//     $sort: {
//       runs: -1,
//     },
//   },
// ]);

//  runs scored by a specific batter season by season

// db.matches.aggregate([
//   {$project: {
//     deliveries:"$innings.overs.deliveries", season:"$info.season", _id:0
//   }},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$match: {
//     "deliveries.batter":"SK Raina"
//   }},
//   {$group: {
//     _id:"$season",
//     "runs": {$sum:"$deliveries.runs.batter"}
//   }},
//   {$sort:{"_id":1}}
// ])

// TODO:
// Player: Raina
// Season: 2009/10 : 528 ; real : 520

// runs by a player match by match
// db.matches.aggregate([
//   {$match: {
//     "info.season":"2009/10",
//   }},
//   {$project: {
//     "matchDate":"$info.dates",
//     "deliveries":"$innings.overs.deliveries",
//     "season":"$info.season",
//     "teams":"$info.teams"
//   }},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$match:{
//     "deliveries.batter":"SK Raina"
//   }},
//   {$group:
//    {_id:{matchDate:"$matchDate",teams:"$teams"},
//     runs:{$sum:"$deliveries.runs.batter"}
// }},
//   {$sort:{"_id.matchDate":-1}}
// ])

// using filter to select elements of an array where a field is missing
// db.matches.aggregate([
//   {$match:{"info.dates":"2010-03-21","info.event.match_number":16,"innings.overs.super_over":{$exists:false}}},
//   {$project:{
//     innings: {$filter:{
//       input: "$innings",
//       as: "innings",
//       cond: {$eq:[{$type:"$$innings.super_over"},"missing"]}
//     }}
//   }}
// ])

//  runs scored by a batter removing the super over
db.matches.aggregate([
  {
    $project: {
      innings: {
        $filter: {
          input: "$innings",
          as: "innings",
          cond: { $eq: [{ $type: "$$innings.super_over" }, "missing"] },
        },
      },
    },
  },
  {
    $project: {
      deliveries: "$innings.overs.deliveries",
    },
  },
  { $unwind: "$deliveries" },
  { $unwind: "$deliveries" },
  { $unwind: "$deliveries" },
  {
    $group: {
      _id: "$deliveries.batter",
      runs: { $sum: "$deliveries.runs.batter" },
    },
  },
  {
    $sort: {
      runs: -1,
    },
  },
]);

// number of matches a player has participated in
// db.matches.aggregate([
//   {$project: {
//     "players":{$objectToArray : "$info.players"},"_id":0
//   }},
//   {$unwind: "$players"},
//   {$unwind: "$players.v"},
//   {$group: {
//     _id: {player:"$players.v"},
//     matches: {$count:{}}
//   }},
//   {$sort: {matches:-1}}
// ])

// number of innings of a player season by season
// this is not including the cases where the player is present in the non-striker end
// db.matches.aggregate([
//   {$project: {
//     matchID:"$_id",
//     deliveries:"$innings.overs.deliveries",
//     season:"$info.season",
//     "_id":0
//   }},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$group: {
//     _id:{matchID:"$matchID",player:"$deliveries.batter",season:"$season"}
//   }},
//   {$group:{
//     _id:{player:"$_id.player"},
//     innings:{$count:{}}
//   }},
//   {$sort: {
//     "innings": -1
//   }},
// ])

// player wise number of innings
// TODO:
// 1.remove the super over thingy
// 2.aggregate by season, team
// db.matches.aggregate([
//   {$project: {
//     "matchID" : "$_id",
//     "deliveries": "$innings.overs.deliveries",
//     "_id":0
//   }},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$unwind: "$deliveries"},
//   {$group: {
//     _id:"$matchID",
//     strikers:{$addToSet: "$deliveries.batter"},
//     non_strikers: {$addToSet: "$deliveries.non_striker"}
//   }
//   },
//   {$project: {
//     _id:"$_id",
//     playingPlayers: {$setUnion: ["$strikers","$non_strikers"]}
//   }},
//   {$unwind: "$playingPlayers"},
//   {$group: {
//     _id: {player: "$playingPlayers"},
//     noInnings: {$count:{}}
//   }},
//   {$sort: {"noInnings":-1}}
// ])

// TODO: issue with number of balls faced for raina in this match
// db.matches.aggregate([
//     {$match:{
//         "info.dates":"2015-04-25",
//     }},
//     {$project:{
//       innings: {$filter:{
//         input: "$innings",
//         as: "innings",
//         cond: {$eq:[{$type:"$$innings.super_over"},"missing"]}
//       }}
//     }},
//     {$project: {
//         "deliveries":"$innings.overs.deliveries"
//     }},
//     {$unwind: "$deliveries"},
//     {$unwind: "$deliveries"},
//     {$unwind: "$deliveries"},
//     {$match: {
//         "deliveries.batter":"SK Raina"
//     }},
//     {$limit: 25}
// ])

// balls faced by each player
// db.matches.aggregate([
//     {$project:{
//       innings: {$filter:{
//         input: "$innings",
//         as: "innings",
//         cond: {$eq:[{$type:"$$innings.super_over"},"missing"]}
//       }},
//       "_id":1,
//       "info":1
//     }},
//     {$project: {
//       "matchID": "$_id",
//       "deliveries": "$innings.overs.deliveries",
//       "matchDate":"$info.dates",
//       "_id" : 0,
//     }},
//     {$unwind: "$deliveries"},
//     {$unwind: "$deliveries"},
//     {$unwind: "$deliveries"},
//     {$match: {
//         "deliveries.extras.wides" : {$exists:false},
//         // "deliveries.extras.noballs" : {$exists:false},
//         // "deliveries.batter": "SK Raina"
//     }},
//     {$facet: {
//       ballsFaced: [
//         {$group: {
//             _id: "$deliveries.batter",
//             balls: {$count: {}}
//         }}
//         ],
//       runsScored: [
//         {$group: {
//           _id: "$deliveries.batter",
//           runs: {
//             "$sum":"$deliveries.runs.batter"
//           }
//         }}
//       ]
//     }},
//     {$project: {
//         activity: {$setUnion:["$runsScored","$ballsFaced"]}
//     }},
//     {$unwind:"$activity"},
//     {$group: {
//         _id: "$activity._id",
//         balls: {$first: "$activity.balls"},
//         runs: {$last: "$activity.runs"}
//     }},
//     {$sort:{
//         runs:-1
//     }}
// ])

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

// -------------- Players Collection with player IDs -------------------//
// db.matches.aggregate([
//   {
//     $facet: {
//       teamPlayer: [
//         {
//           $project: {
//             players: { $objectToArray: "$info.players" },
//             matchID: "$_id",
//             season: "$info.season",
//             _id: 0,
//           },
//         },
//         { $unwind: "$players" },
//         { $unwind: "$players.v" },
//         {
//           $project: {
//             matchID: 1,
//             season: 1,
//             teams: 1,
//             date: 1,
//             team: "$players.k",
//             player: "$players.v",
//           },
//         },
//       ],
//       playerID: [
//         {
//           $project: {
//             playerIDs: { $objectToArray: "$info.registry.people" },
//             matchID: "$_id",
//             season: "$info.season",
//             _id: 0,
//           },
//         },
//         { $unwind: "$playerIDs" },
//         {
//           $project: {
//             matchID: 1,
//             player: "$playerIDs.k",
//             playerID: "$playerIDs.v",
//             season: 1,
//             teams: 1,
//             date: 1,
//           },
//         },
//       ],
//     },
//   },
//   {
//     $project: {
//       teamPlayerIDs: { $setUnion: ["$teamPlayer", "$playerID"] },
//     },
//   },
//   { $unwind: "$teamPlayerIDs" },
//   {
//     $project: {
//       matchID: "$teamPlayerIDs.matchID",
//       team: "$teamPlayerIDs.team",
//       player: "$teamPlayerIDs.player",
//       playerID: "$teamPlayerIDs.playerID",
//     },
//   },
//   {
//     $group: {
//       _id: { matchID: "$matchID", player: "$player" },
//       team: { $addToSet: "$team" },
//       playerID: { $addToSet: "$playerID" },
//     },
//   },
//   {
//     $unwind: {
//       path: "$team",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $unwind: {
//       path: "$playerID",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $project: {
//       matchID: "$_id.matchID",
//       player: "$_id.player",
//       team: 1,
//       playerID: 1,
//       _id: 0,
//     },
//   },
//   { $match: { $expr: { $ne: [{ $type: "$team" }, "missing"] } } },
//  // { $match: { "_id.player": "S Dhawan", "_id.season": "2009/10" } },
//  //TODO: Not working correctly check dhoni's and kohli's number
// ]);
// -----------------------------------------------------//

//------------ Creates Runs Collection -----------------//

// db.matches.aggregate([
//   projectInnings,
//   unwindInnings,
//   projectDeliveries,
//   setBallNo,
//   unwindOvers,
//   unwindDeliveries,
//   projectEachBall,
//   sortSeason,
//   renameTeams,
//   // { $out: "runs" },
// ]);

//------------------------------------------------------//

//------------ Creates Partnership Collection -----------------//

// db.matches.aggregate([
//   projectInnings,
//   unwindInnings,
//   projectDeliveries,
//   setBallNo,
//   unwindOvers,
//   unwindDeliveries,
//   projectEachBall,
//   {
//     $set: {
//       batsmen: {
//         $sortArray: {
//           input: ["$batter", "$nonStriker"],
//           sortBy: 1,
//         },
//       },
//       ballsFaced: {
//         $cond: {
//           if: {
//             $eq: ["$wide", 0],
//           },
//           then: 1,
//           else: 0,
//         },
//       },
//     },
//   },
//   {
//     $group: {
//       _id: {
//         matchID: "$matchID",
//         innings: "$innings",
//         batsmen: "$batsmen",
//       },
//       partnership: {
//         $sum: { $add: ["$batterRuns", "$extraRuns"] },
//       },
//       wicket: {
//         $sum: "$wicket",
//       },
//       ballsFaced: {
//         $sum: "$ballsFaced",
//       },
//       fours: {
//         $sum: {
//           $cond: [{ $eq: ["$boundaries", 4] }, 1, 0],
//         },
//       },
//       sixes: {
//         $sum: {
//           $cond: [{ $eq: ["$boundaries", 6] }, 1, 0],
//         },
//       },
//     },
//   },
//   {
//     $sort: {
//       partnership: -1,
//     },
//   },
//   { $out: "partnershipData" },
// ]);

// db.matches.aggregate([
//   projectInnings,
//   unwindInnings,
//   projectDeliveries,
//   setBallNo,
//   unwindOvers,
//   unwindDeliveries,
//   projectEachBall,
//   {
//     $set: {
//       batsmen: {
//         $sortArray: {
//           input: ["$batter", "$nonStriker"],
//           sortBy: 1,
//         },
//       },
//       ballsFaced: {
//         $cond: {
//           if: {
//             $eq: ["$wide", 0],
//           },
//           then: 1,
//           else: 0,
//         },
//       },
//     },
//   },
//   {
//     $group: {
//       _id: {
//         matchID: "$matchID",
//         innings: "$innings",
//         batsmen: "$batsmen",
//         batter: "$batter",
//       },
//       batterRuns: {
//         $sum: "$batterRuns",
//       },
//       ballsFaced: {
//         $sum: "$ballsFaced",
//       },
//       batterFours: {
//         $sum: {
//           $cond: [{ $eq: ["$boundaries", 4] }, 1, 0],
//         },
//       },
//       batterSixes: {
//         $sum: {
//           $cond: [{ $eq: ["$boundaries", 6] }, 1, 0],
//         },
//       },
//     },
//   },
//   {
//     $set: {
//       firstBatter: { $arrayElemAt: ["$_id.batsmen", 0] },
//       secondBatter: { $arrayElemAt: ["$_id.batsmen", 1] },
//     },
//   },
//   {
//     $facet: {
//       firstBatterRuns: [
//         {
//           $match: {
//             $expr: {
//               $eq: ["$firstBatter", "$_id.batter"],
//             },
//           },
//         },
//         {
//           $set: {
//             batter1Runs: "$batterRuns",
//             batter1BallsFaced: "$ballsFaced",
//             batter1Fours: "$batterFours",
//             batter1Sixes: "$batterSixes",
//           },
//         },
//       ],
//       secondBatterRuns: [
//         {
//           $match: {
//             $expr: {
//               $eq: ["$secondBatter", "$_id.batter"],
//             },
//           },
//         },
//         {
//           $set: {
//             batter2Runs: "$batterRuns",
//             batter2BallsFaced: "$ballsFaced",
//             batter2Fours: "$batterFours",
//             batter2Sixes: "$batterSixes",
//           },
//         },
//       ],
//     },
//   },
//   {
//     $project: {
//       activity: {
//         $setUnion: ["$firstBatterRuns", "$secondBatterRuns"],
//       },
//     },
//   },
//   { $unwind: "$activity" },
//   { $unset: "activity._id.batter" },
//   {
//     $group: {
//       _id: "$activity._id",
//       firstBatterRuns: { $sum: "$activity.batter1Runs" },
//       secondBatterRuns: { $sum: "$activity.batter2Runs" },
//       firstBatterBallsFaced: { $sum: "$activity.batter1BallsFaced" },
//       secondBatterBallsFaced: { $sum: "$activity.batter2BallsFaced" },
//       firstBatterFours: { $sum: "$activity.batter1Fours" },
//       firstBatterSixes: { $sum: "$activity.batter1Sixes" },
//       secondBatterFours: { $sum: "$activity.batter2Fours" },
//       secondBatterSixes: { $sum: "$activity.batter2Sixes" },
//     },
//   },
//   {
//     $sort: {
//       firstBatterRuns: -1,
//     },
//   },
//   { $out: "individualPartershipData" },
// ]);

// db.partnershipData.aggregate([
//   {
//     $lookup: {
//       from: "individualPartershipData",
//       localField: "_id",
//       foreignField: "_id",
//       as: "individualPartnershipData",
//     },
//   },
//   { $unwind: "$individualPartnershipData" },
//   {
//     $project: {
//       _id: 0,
//       matchID: "$_id.matchID",
//       innings: "$_id.innings",
//       firstBatter: { $arrayElemAt: ["$_id.batsmen", 0] },
//       secondBatter: { $arrayElemAt: ["$_id.batsmen", 1] },
//       firstBatterRuns: "$individualPartnershipData.firstBatterRuns",
//       secondBatterRuns: "$individualPartnershipData.secondBatterRuns",
//       firstBatterBallsFaced: "$individualPartnershipData.firstBatterBallsFaced",
//       secondBatterBallsFaced:
//         "$individualPartnershipData.secondBatterBallsFaced",
//       parternship: "$partnership",
//       totalBallsFaced: "$ballsFaced",
//       wicket: "$wicket",
//       fours: "$fours",
//       sixes: "$sixes",
//       firstBatterFours: "$individualPartnershipData.firstBatterFours",
//       firstBatterSixes: "$individualPartnershipData.firstBatterSixes",
//       secondBatterFours: "$individualPartnershipData.secondBatterFours",
//       secondBatterSixes: "$individualPartnershipData.secondBatterSixes",
//     },
//   },
// ]);

//------------------------------------------------------//

//------------ Creates Outs Collection -----------------//
// Different types of outs given in the data:
// stumped, lbw, run out, caught, caught and bowled, bowled

// db.matches.aggregate([
//   projectInnings,
//   unwindInnings,
//   projectDeliveries,
//   setBallNo,
//   unwindOvers,
//   unwindDeliveries,
//   {
//     $match: {
//       "overs.deliveries.wickets": { $ne: null },
//     },
//   },
//   unwindWickets,
//   // unwindFielders,
//   projectOuts,
//   setBowlerWicket,
//   renameTeams,
//   // { $out: "outs" },
// ]);

//------------------------------------------------------//

//------------ Creates Matches Collection -----------------//
// const setMatchNumberAndDate = {
//   $set: {
//     matchNumber: {
//       $cond: {
//         if: { $eq: [{ $type: "$info.event.match_number" }, "missing"] },
//         then: "$info.event.stage",
//         else: "$info.event.match_number",
//       },
//     },
//     matchStartDate: {
//       $arrayElemAt: ["$info.dates", 0],
//     },
//   },
// };
// const setSuperOver = {
//   $set: {
//     isSuperOver: {
//       $size: {
//         $filter: {
//           input: "$innings",
//           as: "inning",
//           cond: { $eq: ["$$inning.super_over", true] },
//         },
//       },
//     },
//   },
// };
// const setTeamScores = [
//   {
//     $set: {
//       team1Innings: { $arrayElemAt: ["$innings", 0] },
//       team2Innings: { $arrayElemAt: ["$innings", 1] },
//     },
//   },
//   {
//     $set: {
//       team1Dels: {
//         $map: {
//           input: "$team1Innings.overs",
//           as: "over",
//           in: {
//             $mergeObjects: [
//               "$$over",
//               {
//                 runs: { $sum: "$$over.deliveries.runs.total" },
//                 extras: { $sum: "$$over.deliveries.runs.extras" },
//                 wickets: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: { $gt: ["$$delivery.wickets", null] },
//                     },
//                   },
//                 },
//                 fours: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: {
//                         $and: [
//                           {
//                             $eq: [
//                               { $type: "$$delivery.runs.non_boundary" },
//                               "missing",
//                             ],
//                           },
//                           { $eq: ["$$delivery.runs.batter", 4] },
//                         ],
//                       },
//                     },
//                   },
//                 },
//                 sixes: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: {
//                         $and: [
//                           {
//                             $eq: [
//                               { $type: "$$delivery.runs.non_boundary" },
//                               "missing",
//                             ],
//                           },
//                           { $eq: ["$$delivery.runs.batter", 6] },
//                         ],
//                       },
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       },
//       team2Dels: {
//         $map: {
//           input: "$team2Innings.overs",
//           as: "over",
//           in: {
//             $mergeObjects: [
//               "$$over",
//               {
//                 runs: { $sum: "$$over.deliveries.runs.total" },
//                 extras: { $sum: "$$over.deliveries.runs.extras" },
//                 wickets: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: { $gt: ["$$delivery.wickets", null] },
//                     },
//                   },
//                 },
//                 fours: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: {
//                         $and: [
//                           {
//                             $eq: [
//                               { $type: "$$delivery.runs.non_boundary" },
//                               "missing",
//                             ],
//                           },
//                           { $eq: ["$$delivery.runs.batter", 4] },
//                         ],
//                       },
//                     },
//                   },
//                 },
//                 sixes: {
//                   $size: {
//                     $filter: {
//                       input: "$$over.deliveries",
//                       as: "delivery",
//                       cond: {
//                         $and: [
//                           {
//                             $eq: [
//                               { $type: "$$delivery.runs.non_boundary" },
//                               "missing",
//                             ],
//                           },
//                           { $eq: ["$$delivery.runs.batter", 6] },
//                         ],
//                       },
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       },
//     },
//   },
//   {
//     $set: {
//       team1Score: { $sum: "$team1Dels.runs" },
//       team2Score: { $sum: "$team2Dels.runs" },
//       team1Extras: { $sum: "$team1Dels.extras" },
//       team2Extras: { $sum: "$team2Dels.extras" },
//       team1Wickets: { $sum: "$team1Dels.wickets" },
//       team2Wickets: { $sum: "$team2Dels.wickets" },
//       team1Fours: { $sum: "$team1Dels.fours" },
//       team1Sixes: { $sum: "$team1Dels.sixes" },
//       team2Fours: { $sum: "$team2Dels.fours" },
//       team2Sixes: { $sum: "$team2Dels.sixes" },
//     },
//   },
//   {
//     $unset: ["team2Innings", "team1Innings", "team1Dels", "team2Dels"],
//   },
// ];
// const projectMatches = {
//   $project: {
//     _id: 0,
//     matchID: "$_id",
//     matchNumber: 1,
//     season: "$info.season",
//     matchStartDate: 1,
//     city: "$info.city",
//     tossWon: "$info.toss.winner",
//     tossDecision: "$info.toss.decision",
//     // batting first
//     team1: { $arrayElemAt: ["$info.teams", 0] },
//     // batting second
//     team2: { $arrayElemAt: ["$info.teams", 1] },
//     teamWon: "$info.outcome.winner",
//     wonByWickets: "$info.outcome.by.wickets",
//     wonByRuns: "$info.outcome.by.runs",
//     team1Score: 1,
//     team2Score: 1,
//     team1Extras: 1,
//     team2Extras: 1,
//     team1Wickets: 1,
//     team2Wickets: 1,
//     team1Fours: 1,
//     team1Sixes: 1,
//     team2Fours: 1,
//     team2Sixes: 1,
//     playerOfMatch: "$info.player_of_match",
//     isSuperOver: 1,
//   },
// };
// db.matches.aggregate([
//   ...setTeamScores,
//   setSuperOver,
//   setMatchNumberAndDate,
//   projectMatches,
//   { $out: "matches" },
// ]);
// //----------------------------------------------//
