import clsx from "clsx";

// TODO:
// 1. we should change the theme of unselected button
// 2. when hovering over the unselected button it shouldn't reflect any changes
// 3. add focus ring
// 4. switch like background??
// 5. Add shadow on hover
export function DoubleButton({ isBowlingSelected, setIsBowlingSelected }) {
  return (
    <div className="p-4 flex items-center justify-center">
      {console.log("Rendering DoubleButton!!")}
      <div class="flex text-gray-900 gap-0.5">
        <button
          className={clsx(
            "font-bold sm:text-xl py-[6px] sm:py-[9px] text-center",
            isBowlingSelected
              ? "scale-90 bg-slate-400 opacity-75"
              : "scale-110 bg-slate-100 ",
            "rounded-l-lg",
            "w-20 sm:w-28",
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
            "font-bold sm:text-xl py-[6px] sm:py-[9px] text-center ",
            isBowlingSelected
              ? "scale-110 bg-slate-100 "
              : "scale-90 bg-slate-400 opacity-75",
            "rounded-r-lg",
            "w-20 sm:w-28",
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
