const batterColumnMaps = {
  player: "PLAYER",
  matches: "MAT",
  innings: "INNS",
  runs: "RUNS",
  sr: "SR",
  avg: "AVG",
  hs: "HS",
  sixes: "6S",
  fours: "4S",
};

const bowlerColumnMaps = {
  player: "PLAYER",
  matches: "MAT",
  innings: "INNS",
  overs: "OV",
  wickets: "WKTS",
  runs: "RUNS",
  sr: "SR",
  avg: "AVG",
  econ: "ECON",
};

export function getColumnsForSummaryTable({
  singleDataPoint,
  isBowlingSelected,
}) {
  const columns = Object.keys(singleDataPoint);
  console.log(columns);
  return isBowlingSelected
    ? {
        apiCols: columns,
        mappedCols: columns.map((column) => bowlerColumnMaps[column]),
      }
    : {
        apiCols: columns,
        mappedCols: columns.map((column) => batterColumnMaps[column]),
      };
}
