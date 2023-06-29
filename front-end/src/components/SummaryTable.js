import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { getColumnsForSummaryTable } from "@/utils/getColumnsForSummaryTable";

export function SummaryTable({ data, isBowlingSelected }) {
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
    <div className="flex justify-center text-black">
      <div className="max-w-xs sm:max-w-4xl mt-4 border-2 rounded-lg overflow-x-auto ">
        <table className="table-fixed border-collapse ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="w-10 bg-gradient-to-r from-teal-400 to-lime-400"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-center px-3">
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
          <tbody className="bg-gradient-to-r from-teal-100 to-lime-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gradient-to-r hover:from-teal-200  hover:to-lime-300"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="hover:font-bold hover:overflow-hidden px-4 "
                  >
                    {console.log(cell.getContext())}
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
