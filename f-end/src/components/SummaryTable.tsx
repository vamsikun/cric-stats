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
  metadata;
  isBowlingSelected: boolean;
};

export function SummaryTable({
  data,
  isBowlingSelected,
  metadata,
}: TSummaryTableProps) {
  const columns = getColumnsForSummaryTable({
    singleDataPoint: data[0],
    isBowlingSelected: isBowlingSelected,
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
      <div className="flex mt-4 flex-col-reverse items-end overflow-auto justify-center text-slate-700">
        <div className="text-white text-xs sm:text-sm font-semibold mr-2">
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
                        // NOTE: width of the columns is being set here;
                        // these value are picked up in such a way that the width can occupy the max-length content
                        // for small screen sizes, wrapping is allowed
                        "text-sm sm:text-base py-1 sm:py-1.5 bg-teal-300",
                        index === 0
                          ? "min-w-[2.5rem] sm:min-w-[3rem] sticky left-0 z-40"
                          : index === 1
                          ? // NOTE: for player name column I am also setting the max-width as the player name lengths can vary a lot so fixing this width
                            "pl-2 text-left sticky left-[2.5rem] sm:left-[3rem] z-20 max-w-[7rem] min-w-[7rem] sm:max-w-[11rem] sm:min-w-[11rem] before:absolute before:-right-1 before:top-0 before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300"
                          : "min-w-[4rem] sm:min-w-[4.5rem]",
                        // TODO: why === is not working here?
                        selectedColPosition == index ? "bg-teal-600" : null
                      )}
                    >
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
            <tbody className="relative z-0">
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        // NOTE: for the width of these elements look at the width of the header column
                        // these elements min-width is being set there
                        "text-sm sm:text-base py-1.5 sm:py-2",
                        rowIndex % 2 === 0
                          ? selectedColPosition == cellIndex
                            ? "bg-teal-200"
                            : "bg-teal-100"
                          : selectedColPosition == cellIndex
                          ? "bg-teal-300"
                          : "bg-teal-200",
                        cellIndex === 0
                          ? "text-center sticky left-0"
                          : cellIndex === 1
                          ? "pl-2 text-left sticky left-[2.5rem] sm:left-[3rem]  sm:overflow-ellipsis sm:whitespace-nowrap before:absolute before:-right-1 before:top-0 before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300"
                          : "text-center"
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
