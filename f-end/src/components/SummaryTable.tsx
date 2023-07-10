import { getColumnsForSummaryTable } from "@/utils/getColumnsForSummaryTable";
import clsx from "clsx";
import { TSingleData } from "@/utils/getColumnsForSummaryTable";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// TODO: specify w-10 on 'th' element is not working even when table-fixed is used

// type of the input data that comes into the summary table
export type TData = TSingleData[];
export type TSummaryTableProps = {
  data: TData;
  metadata;
  columnMapIndex: number;
  summaryTableColStyles;
};

export function SummaryTable({
  data,
  columnMapIndex,
  metadata,
  summaryTableColStyles,
}: TSummaryTableProps) {
  const columns = getColumnsForSummaryTable({
    singleDataPoint: data[0],
    columnMapIndex: columnMapIndex,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const selectedColPosition = metadata["columnPosition"];
  const minRequirement = metadata["havingClause"];
  return (
    // This flex is necessary other wise the child element's table will occupy the whole width
    <div className="flex justify-center ">
      {/* If we don't have the overflow-auto on the parent container, then the parent container will always have enough width for the table in the child
      so the overflow of child table won't come into play. But when we set the overflow property to the parent, then due to the child precedence of the overflow propoerty
      we will be able to scroll the table */}
      <div className="flex mt-4 mb-8 flex-col-reverse items-end overflow-auto justify-center text-slate-700">
        <div className="text-white text-[0.5rem] sm:text-xs font-semibold mr-2">
          {minRequirement}
        </div>
        {/* Combination of w-full in the child-item and items-end(flex-col) in the parent container makes the table to be fixed in a constrained space
        which allows for the scrolling of the table. */}
        <div className="overflow-x-auto w-full max-h-72 sm:max-h-96 border-2 rounded-lg ">
          <table className="table-fixed">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th
                      key={header.id}
                      className={clsx(
                        index in summaryTableColStyles["headerCols"]
                          ? summaryTableColStyles["headerCols"][index]
                          : summaryTableColStyles["headerCols"]["other"],
                        selectedColPosition == index &&
                          summaryTableColStyles["headerCols"]["selectedCol"]
                      )}
                    >
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative z-0">
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, colIndex) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        colIndex in summaryTableColStyles["cellCols"]
                          ? summaryTableColStyles["cellCols"][colIndex]
                          : summaryTableColStyles["cellCols"]["other"],
                        selectedColPosition == colIndex &&
                          summaryTableColStyles["cellCols"]["selectedCol"]
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}