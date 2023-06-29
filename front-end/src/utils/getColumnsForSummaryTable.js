import { createColumnHelper } from "@tanstack/react-table";

const batterColumnMaps = {
  player: "Player",
  matches: "Matches",
  innings: "Innings",
  runs: "Runs",
  sr: "SR",
  avg: "Average",
  hs: "High Score",
  sixes: "Sixes",
  fours: "Fours",
};

const bowlerColumnMaps = {
  player: "Player",
  matches: "Matches",
  innings: "Innings",
  overs: "Overs",
  wickets: "Wickets",
  runs: "Runs",
  sr: "SR",
  avg: "Average",
  econ: "Economy",
};

export function getColumnsForSummaryTable({
  singleDataPoint,
  isBowlingSelected,
}) {
  const columnHelper = createColumnHelper();
  const columns = Object.keys(singleDataPoint);
  return isBowlingSelected
    ? columns.map((column) =>
        columnHelper.accessor(column, { header: bowlerColumnMaps[column] })
      )
    : columns.map((column) =>
        columnHelper.accessor(column, { header: batterColumnMaps[column] })
      );
}
