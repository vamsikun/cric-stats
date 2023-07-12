import clsx from "clsx";

// TODO:
// 1. we should change the theme of unselected button
// 2. when hovering over the unselected button it shouldn't reflect any changes
// 3. add focus ring
// 4. switch like background??
// 5. Add shadow on hover
export function DoubleButton({ isRightSelected, setIsRightSelected, options }) {
  return (
    <div className="p-4 flex items-center justify-center">
      <div className="flex text-gray-900 gap-0.5">
        <button
          className={clsx(
            "font-semibold sm:text-xl py-[6px] sm:py-[9px] text-center",
            isRightSelected
              ? "scale-90 bg-slate-400 opacity-75"
              : "scale-110 bg-slate-100 ",
            "rounded-l-lg",
            "w-20 sm:w-28",
            "transition-all"
          )}
          onClick={() => {
            setIsRightSelected(false);
          }}
        >
          {options[0]}
        </button>
        <button
          className={clsx(
            "font-semibold sm:text-xl py-[6px] sm:py-[9px] text-center ",
            isRightSelected
              ? "scale-110 bg-slate-100 "
              : "scale-90 bg-slate-400 opacity-75",
            "rounded-r-lg",
            "w-20 sm:w-28",
            "transition-all"
          )}
          onClick={() => {
            setIsRightSelected(true);
          }}
        >
          {options[1]}
        </button>
      </div>
    </div>
  );
}
