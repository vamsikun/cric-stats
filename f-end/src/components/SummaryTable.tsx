import { getColumnsForSummaryTable } from "@/utils/getColumnsForSummaryTable";
import clsx from "clsx";
import { eachCellInTable } from "../data";
import { TBatterData, TBowlerData } from "@/utils/getColumnsForSummaryTable";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// TODO: specify w-10 on 'th' element is not working even when table-fixed is used

// type of the input data that comes into the summary table
export type TData = (TBatterData | TBowlerData)[];
export type TSummaryTableProps = {
  data: TData;
  isBowlingSelected: boolean;
};

export function SummaryTable({ data, isBowlingSelected }: TSummaryTableProps) {
  const columns = getColumnsForSummaryTable({
    singleDataPoint: data[0],
    isBowlingSelected: isBowlingSelected,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex justify-center text-slate-700">
      <div className="max-h-72 sm:max-h-96 mt-4 border-2 rounded-lg overflow-x-auto ">
        <table className="table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
