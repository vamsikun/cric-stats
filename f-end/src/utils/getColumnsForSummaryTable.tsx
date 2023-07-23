import { createColumnHelper } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { columnMaps } from "@/data";

export type TBatterData = {
  pos: number;
  player: string;
  team: string;
  opposition: string;
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

export type TTeamSummaryData = {
  season: string;
  matches: number;
  wins: number;
  losses: number;
  high_score: string;
  low_score: string;
  wickets: number;
  fours: number;
  sixes: number;
  run_rate: number;
};

export type TSingleData = TBatterData | TBowlerData | TTeamSummaryData;

export type TMetadata = {
  columnPosition?: string;
  havingClause?: string;
};

export type TApiData = {
  data: TSingleData[];
  metadata: TMetadata;
};

export type TGetColumnsProps = {
  singleDataPoint: TBatterData | TBowlerData | TTeamSummaryData;
  columnMapIndex: number;
};

export type TGetColumnsReturn = {
  apiCols: string[];
  mappedCols: string[];
};

export function getColumnsForSummaryTable({
  singleDataPoint,
  columnMapIndex,
}: TGetColumnsProps): ColumnDef<TSingleData, string | number>[] {
  const columnHelper = createColumnHelper<TSingleData>();
  const rawColumns = Object.keys(singleDataPoint);
  const columns = rawColumns.map((col, index) => {
    if (col == "hs") {
      return columnHelper.accessor(col as keyof TSingleData, {
        header: () => columnMaps[columnMapIndex][col],
        cell: (info): string =>
          (Math.trunc((info.getValue() as number) / 10) as string) +
          ((info.getValue() as number) % 10 == 1 ? "*" : ""),
      });
    }
    return columnHelper.accessor(col as keyof TSingleData, {
      header: () => columnMaps[columnMapIndex][col],
    });
  });
  return columns;
}
