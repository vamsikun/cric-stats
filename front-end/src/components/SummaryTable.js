import { getColumnsForSummaryTable } from "@/utils/getColumnsForSummaryTable";
import clsx from "clsx";

// TODO: specify w-10 on 'th' element is not working even when table-fixed is used

export function SummaryTable({ data, isBowlingSelected }) {
  const { apiCols, mappedCols } = getColumnsForSummaryTable({
    singleDataPoint: data[0],
    isBowlingSelected: isBowlingSelected,
  });

  return (
    <div className="flex justify-center text-slate-700">
      <div className="max-h-72 sm:max-h-96 mt-4 border-2 rounded-lg overflow-x-auto ">
        <table className="table-fixed">
          <thead>
            <tr>
              {apiCols.map((apiCol, index) => (
                <th
                  key={apiCol}
                  className={clsx(
                    "py-1.5 text-center bg-teal-300 sticky top-0 text-xs sm:text-sm font-semibold",
                    index === 0
                      ? "left-0 z-10"
                      : // keep the width of the header element so that it can accommodate the maximum width of the element present in this column
                        // if we do this then the width of the columns won't change depending on the content present in the column
                        // it will be fixed to the width that we have specified for the header
                        "min-w-[3.5rem] max-w-[3.5rem]"
                  )}
                >
                  {index === 0 ? (
                    <div className="flex">
                      {/* NOTE:
                        when we set the width of an element inside a flex container,
                        whenever the content goes above that limit it will overflow the item box
                        */}
                      <div className="w-8 text-center mr-2">POS</div>
                      <div className="w-32 sm:w-40 text-left">
                        {mappedCols[index]}
                      </div>
                    </div>
                  ) : (
                    mappedCols[index]
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {data.map((playerData, rowIndex) => (
              <tr key={rowIndex} className={clsx()}>
                {apiCols.map((col, index) => (
                  <td
                    key={index}
                    className={clsx(
                      "text-center py-1.5 text-sm sm:text-base",
                      index === 0 ? "sticky left-0 z-1" : null,
                      rowIndex % 2 != 0 ? "bg-teal-200" : "bg-teal-100"
                    )}
                  >
                    {index === 0 ? (
                      <div className="flex font-medium ">
                        {/* NOTE:
                        when we set the width of an element inside a flex container,
                        whenever the content goes above that limit it will overflow the item box
                        */}
                        <div className="w-8 mr-2">{rowIndex + 1}</div>
                        <div className="w-32 sm:w-40 text-left sm:truncate">
                          {playerData[col]}
                        </div>
                      </div>
                    ) : (
                      playerData[col]
                    )}
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
