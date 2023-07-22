import { CustomFilter } from "./CustomFilter";
import { playerTypes, seasons } from "@/data";
export const PlayerSummaryFilter = ({ apiData, filters, filterDispatcher }) => {
  return (
    <div className="mt-8 flex gap-2 justify-center items-center ">
      <CustomFilter
        type="small"
        setSelectedOption={(playerType) => {
          filterDispatcher({
            type: "setPlayerType",
            payload: { playerType: playerType, prevData: apiData },
          });
        }}
        selectedOption={filters["playerType"]}
        options={playerTypes}
      />
      <CustomFilter
        type="small"
        setSelectedOption={(season) => {
          filterDispatcher({
            type: "setSeason",
            payload: { season: season, prevData: apiData },
          });
        }}
        selectedOption={filters["season"]}
        options={seasons}
      />
      <CustomFilter
        type="large"
        setSelectedOption={(setSelectedStat) => {
          filterDispatcher({
            type: "setSelectedStat",
            payload: { stat: setSelectedStat, prevData: apiData },
          });
        }}
        selectedOption={filters["selectedStat"]}
        options={filters["stats"]}
      />
    </div>
  );
};
