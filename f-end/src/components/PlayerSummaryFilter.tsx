import { CustomFilter } from "./CustomFilter";
export const PlayerSummaryFilter = ({
  selectedSeason,
  setSelectedSeason,
  seasons,
  selectedStat,
  setSelectedStat,
  stats,
  selectedPlayerType,
  setSelectedPlayerType,
  playerTypes,
}) => {
  return (
    <div className="mt-8 flex gap-2 justify-center items-center ">
      <CustomFilter
        type="small"
        setSelectedOption={setSelectedPlayerType}
        selectedOption={selectedPlayerType}
        options={playerTypes}
     />
      <CustomFilter
        type="small"
        setSelectedOption={setSelectedSeason}
        selectedOption={selectedSeason}
        options={seasons}
      />
      <CustomFilter
        type="large"
        setSelectedOption={setSelectedStat}
        selectedOption={selectedStat}
        options={stats}
      />
    </div>
  );
};
