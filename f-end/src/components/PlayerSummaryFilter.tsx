import { CustomFilter } from "./CustomFilter";
export const PlayerSummaryFilter = ({
  selectedSeason,
  setSelectedSeason,
  seasons,
  selectedStat,
  setSelectedStat,
  stats,
}) => {
  return (
    <div className="flex gap-1 justify-center items-center ">
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
