import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const CustomFilter = ({
  width,
  selectedOption,
  setSelectedOption,
  options,
}) => {
  return (
    <div className={`relative w-[${width}rem] text-gray-900`}>
      <Listbox value={selectedOption} onChange={setSelectedOption}>
        <Listbox.Button className="py-2 pr-1 rounded-lg bg-gradient-to-r from-teal-100 to-lime-200 relative w-full flex justify-center items-center">
          <span className="flex-grow block truncate text-lg font-semibold">
            {selectedOption.value}
          </span>
          <span>
            <ChevronUpDownIcon
              className="h-6 w-6 text-gray-900 "
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-0.5 w-full max-h-60 overflow-auto rounded-md bg-gradient-to-r from-teal-100 to-lime-200 py-1 text-base shadow-lg">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              className={({ active, selected }) => {
                return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active
                    ? "bg-gradient-to-r from-teal-200 to-lime-300"
                    : "text-gray-900"
                }`;
              }}
              value={option}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-bold" : "font-normal"
                    }`}
                  >
                    {option.value}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-400">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export const Filter = ({
  selectedSeason,
  setSelectedSeason,
  seasons,
  selectedStat,
  setSelectedStat,
  stats,
}) => {
  return (
    <div className="flex gap-1 justify-center items-center ">
      {console.log("Rendering Filter!!")}
      <CustomFilter
        width="8"
        setSelectedOption={setSelectedSeason}
        selectedOption={selectedSeason}
        options={seasons}
      />
      <CustomFilter
        width="16"
        setSelectedOption={setSelectedStat}
        selectedOption={selectedStat}
        options={stats}
      />
    </div>
  );
};
