import clsx from "clsx";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// type of the input data that comes into the summary table

export function SummaryTableSkeleton({ summaryTableColStyles }) {
  const data = Array(10).fill({});
  const rawcolumns = Array(10).fill("c");

  const columnHelper = createColumnHelper();
  const columns = rawcolumns.map((col, index) =>
    columnHelper.accessor(col, {
      header: () => (
        <div className="w-16 animate-pulse h-5 ml-2 bg-gray-400 text-gray-400 rounded-md opacity-50">
          Hel
        </div>
      ),
      cell: (info) => (
        <div className="w-16 animate-ping h-5 ml-2 bg-gray-400 text-gray-400 rounded-md opacity-50">
          Hel
        </div>
      ),
    })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const selectedColPosition = undefined;
  return (
    // This flex is necessary other wise the child element's table will occupy the whole width

    // when we specify height explicitly in the parent container,
    // then if the margin of the child element crosses the border, then the child will go off the borders of the parent container
    // here the height will be depended on the child elements heights, which have been fixed static
    <div className="mt-6 flex justify-center items-start ">
      {/* If we don't have the overflow-auto on the parent container, then the parent container will always have enough width for the table in the child
      so the overflow of child table won't come into play. But when we set the overflow property to the parent, then due to the child precedence of the overflow propoerty
      we will be able to scroll the table */}
      <div className="flex flex-col-reverse items-end overflow-auto justify-center text-slate-700">
        {/* specifying height for the metadata to keep the table container size static */}
        <div className="text-[0.5rem] sm:text-xs mr-2 h-3 sm:h-4">
          {undefined}
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
