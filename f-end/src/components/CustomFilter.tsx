import { Listbox, Transition } from "@headlessui/react";
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
  type === "small"
    ? (width = "w-[5rem] sm:w-[7rem]")
    : (width = "w-[10rem] sm:w-[14rem]");
  return (
    //sm:w-[7rem], sm:w-[12rem], w-[5rem], w-[9rem]
    <div className={`relative z-20`}>
      <Listbox
        as="div"
        // TODO: this value helps in selected??
        value={selectedOption}
        onChange={setSelectedOption}
        className={"text-gray-900 "}
      >
        <Listbox.Button
          className={`${width} bg-slate-100  py-1.5 sm:py-2 rounded-lg flex justify-between items-center transition-all`}
        >
          <span className="pl-2 sm:pl-4 text-sm sm:text-lg font-semibold truncate">
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
        <div className="absolute mt-0.5 w-full rounded-lg overflow-hidden shadow-2xl">
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              as="ul"
              className="max-h-52 bg-slate-100 overflow-y-auto"
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active, selected }) => {
                    return `relative cursor-pointer py-2 pl-2 sm:pl-4 text-sm sm:text-lg ${
                      active ? "font-semibold" : "text-gray-900"
                    } ${selected && "font-bold bg-gray-400 rounded-md"}`;
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
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
