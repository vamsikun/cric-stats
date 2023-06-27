import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const SeasonFilter = ({ selectedSeason, setSelectedSeason, seasons }) => {
  return (
    <div className="relative w-28 text-gray-900">
      <Listbox value={selectedSeason} onChange={setSelectedSeason}>
        <Listbox.Button className="py-2 rounded-lg bg-gradient-to-r from-teal-100 to-lime-200 relative w-full flex justify-center items-center">
          <span className="flex-grow block truncate text-lg font-semibold">
            {selectedSeason.season}
          </span>
          <span>
            <ChevronUpDownIcon
              className="h-6 w-6 text-gray-900 "
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gradient-to-r from-teal-100 to-lime-200 py-1 text-base shadow-lg">
          {seasons.map((season) => (
            <Listbox.Option
              key={season.id}
              className={({ active, selected }) => {
                return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active
                    ? "bg-gradient-to-r from-teal-200 to-lime-300"
                    : "text-gray-900"
                }`;
              }}
              value={season}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-bold" : "font-normal"
                    }`}
                  >
                    {season.season}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-400">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
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

export const Filter = ({ selectedSeason, setSelectedSeason, seasons }) => {
  return (
    <div className="flex justify-center items-center ">
      {console.log("Rendering Filter!!")}
      <SeasonFilter
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        seasons={seasons}
      />
    </div>
  );
};
