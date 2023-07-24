import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

// TODO:
// 1. add an icon for selected option
// 2. understand how the options box hides itself when clicked on other button

export const CustomFilter = ({
  type,
  selectedOption,
  setSelectedOption,
  options,
}) => {
  let width;
  switch (type) {
    case "small":
      width = "w-[4.5rem] sm:w-[6.5rem]";
      break;
    case "medium":
      width = "w-[6.5rem] sm:w-[8.5rem]";
      break;
    case "large":
      width = "w-[8.5rem] sm:w-[12.5rem]";
  }
  return (
    <div className={`relative z-20`}>
      <Listbox
        as="div"
        // TODO: this value helps in selected??
        value={selectedOption}
        onChange={setSelectedOption}
        className={"text-slate-100 "}
      >
        <Listbox.Button
          className={`${width} py-1.5 rounded-lg flex justify-between items-center transition-all bg-slate-800 `}
        >
          <span className="pl-2 sm:pl-4 text-xs sm:text-sm font-semibold truncate">
            {selectedOption.value}
          </span>
          <span>
            <ChevronUpDownIcon
              className="sm:h-6 sm:w-6 h-4 w-4"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        {/* Have used this div for hiding the scrollbar going out of the rounded border */}
        <div className="absolute mt-0.5 w-full rounded-lg overflow-hidden shadow-lg bg-slate-600">
          <Listbox.Options as="ul" className="max-h-52 overflow-y-auto">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                className={({ active, selected }) => {
                  return `relative cursor-pointer py-2 pl-2 sm:pl-4 text-sm sm:text-lg ${
                    active ? "font-semibold" : "text-slate-100"
                  } ${selected && "text-cyan-500 font-semibold rounded-md"}`;
                }}
                // TODO: sends the selected value to onChange function??
                value={option}
              >
                {({ selected }) => (
                  <span className={`block truncate`}>{option.value}</span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};
