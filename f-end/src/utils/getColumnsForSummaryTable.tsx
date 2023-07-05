import { createColumnHelper } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";

export type TBatterData = {
  pos: number;
  player: string;
  matches: number;
  innings: number;
  runs: number;
  hs: number;
  sr: number;
  avg: number;
  sixes: number;
  fours: number;
};

export type TBowlerData = {
  pos: number;
  player: string;
  matches: number;
  innings: number;
  overs: number;
  dots_percentage: number;
  wickets: number;
  runs: number;
  sr: number;
  avg: number;
  econ: number;
};

export type TPlayerData = TBatterData | TBowlerData;

export type TGetColumnsProps = {
  singleDataPoint: TBatterData | TBowlerData;
  isBowlingSelected: boolean;
};

export type TGetColumnsReturn = {
  apiCols: string[];
  mappedCols: string[];
};

const batterColumnMaps = {
  pos: "POS",
  player: "PLAYER",
  matches: "MAT",
  innings: "INNS",
  runs: "RUNS",
  hs: "HS",
  sr: "SR",
  avg: "AVG",
  sixes: "6S",
  fours: "4S",
};

const bowlerColumnMaps = {
  pos: "POS",
  player: "PLAYER",
  matches: "MAT",
  innings: "INNS",
  overs: "OV",
  dots_percentage: "DOT %",
  wickets: "WKTS",
  runs: "RUNS",
  sr: "SR",
  avg: "AVG",
  econ: "ECON",
};

export function getColumnsForSummaryTable({
  singleDataPoint,
  isBowlingSelected,
}: TGetColumnsProps): ColumnDef<TBatterData | TBowlerData, string | number>[] {
  const columnHelper = createColumnHelper<TBatterData | TBowlerData>();
  const rawColumns = Object.keys(singleDataPoint);
  const columns = rawColumns.map((col, index) => {
    return columnHelper.accessor(col as keyof TPlayerData, {
      header: () =>
        isBowlingSelected ? bowlerColumnMaps[col] : batterColumnMaps[col],
    });
  });
  return columns;
}
