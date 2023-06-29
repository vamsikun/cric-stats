import clsx from "clsx";

// TODO:
// 1. we should change the theme of unselected button
// 2. when hovering over the unselected button it shouldn't reflect any changes
// 3. add focus ring
export function DoubleButton({ isBowlingSelected, setIsBowlingSelected }) {
  return (
    <div className="mt-20 p-4 flex items-center justify-center">
      {console.log("Rendering DoubleButton!!")}
      <div class="flex gap-0.5">
        <button
          className={clsx(
            "shadow-sm font-semibold text-gray-900 text-base sm:text-lg sm:tracking-wide",
            isBowlingSelected
              ? "scale-90 bg-gradient-to-r from-teal-100 to-lime-200 text-gray-500 opacity-50"
              : "scale-110 bg-gradient-to-r from-teal-300 to-lime-300",
            "rounded-l-lg",
            "py-2 text-center",
            "w-20 sm:w-32",
            "transition-all"
          )}
          onClick={() => {
            setIsBowlingSelected(false);
          }}
        >
          Batting
        </button>
        <button
          className={clsx(
            "font-semibold text-gray-900 text-base sm:text-lg sm:tracking-wide",
            isBowlingSelected
              ? "scale-110 bg-gradient-to-r from-lime-300 to-teal-300"
              : "scale-90 bg-gradient-to-r from-lime-200 to-teal-100 text-gray-500 opacity-50",
            "rounded-r-lg",
            "py-2 text-center",
            "w-20 sm:w-32",
            "transition-all"
          )}
          onClick={() => {
            setIsBowlingSelected(true);
          }}
        >
          Bowling
        </button>
      </div>
    </div>
  );
}
