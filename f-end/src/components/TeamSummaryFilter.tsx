import { CustomFilter } from "@/components/CustomFilter";
export const TeamSummaryFilter = ({
  filter,
  filterDispatcher,
  teamOptions,
  inningsOptions,
  teamTypeOptions,
}) => {
  const team = filter["team"];
  const innings = filter["innings"];
  const teamType = filter["teamType"];
  return (
    <div className="flex gap-1 justify-center items-center">
      <CustomFilter
        type="small"
        selectedOption={teamType}
        setSelectedOption={(teamType) =>
          filterDispatcher({ type: "teamType", payload: teamType })
        }
        options={teamTypeOptions}
      />
      <CustomFilter
        type="small"
        selectedOption={team}
        setSelectedOption={(team) =>
          filterDispatcher({ type: "team", payload: team })
        }
        options={teamOptions}
      />
      <CustomFilter
        type="large"
        selectedOption={innings}
        setSelectedOption={(innings) =>
          filterDispatcher({ type: "innings", payload: innings })
        }
        options={inningsOptions}
      />
    </div>
  );
};
