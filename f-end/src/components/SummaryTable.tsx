import { getColumnsForSummaryTable } from "@/utils/getColumnsForSummaryTable";
import clsx from "clsx";
import { TSingleData } from "@/utils/getColumnsForSummaryTable";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// type of the input data that comes into the summary table

export type TData = TSingleData[];
export type TSummaryTableProps = {
  apiData;
  columnMapIndex: number;
  summaryTableColStyles;
  spinner: boolean;
};

export function SummaryTable({
  apiData,
  columnMapIndex,
  summaryTableColStyles,
  spinner = false,
}: TSummaryTableProps) {
  const data = apiData["data"];
  const metadata = apiData["metadata"];
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

    // when we specify height explicitly in the parent container,
    // then if the margin of the child element crosses the border, then the child will go off the borders of the parent container
    // here the height will be depended on the child elements heights, which have been fixed static
    <div className=" relative mt-6 flex justify-center items-start ">
      {spinner && (
        <div className="opacity-100 z-40 mx-auto -top-6 bottom-0 absolute">
          <svg
            aria-hidden="true"
            className="w-8 h-8 absolute top-1/2 bottom-1/2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {/* If we don't have the overflow-auto on the parent container, then the parent container will always have enough width for the table in the child
      so the overflow of child table won't come into play. But when we set the overflow property to the parent, then due to the child precedence of the overflow propoerty
      we will be able to scroll the table */}
      <div
        className={clsx(
          "transition-all flex flex-col-reverse items-end overflow-auto justify-center text-slate-700",
          spinner && "opacity-20 pointer-events-none"
        )}
      >
        {/* specifying height for the metadata to keep the table container size static */}
        <div className="text-white text-[0.5rem] sm:text-xs mr-2 h-3 sm:h-4">
          {minRequirement}
        </div>
        {/* Combination of w-full in the child-item and items-end(flex-col) in the parent container makes the table to be fixed in a constrained space
        which allows for the scrolling of the table. */}
        <div className="overflow-x-auto w-full h-72 sm:h-96 border-2 rounded-lg ">
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
