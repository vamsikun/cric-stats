import { CustomFilter } from "@/components/CustomFilter";
import { teamTypesOptions, teamsOptions, inningsOptions } from "@/data";
export const TeamSummaryFilter = ({ apiData, filter, filterDispatcher }) => {
  const team = filter["team"];
  const innings = filter["innings"];
  const teamType = filter["teamType"];
  return (
    <div className="mt-8 flex gap-1 justify-center items-center">
      <CustomFilter
        type="small"
        selectedOption={teamType}
        setSelectedOption={(teamType) =>
          filterDispatcher({
            type: "setTeamType",
            payload: { teamType: teamType, prevData: apiData },
          })
        }
        options={teamTypesOptions}
      />
      <CustomFilter
        type="small"
        selectedOption={team}
        setSelectedOption={(team) =>
          filterDispatcher({
            type: "setTeam",
            payload: { team: team, prevData: apiData },
          })
        }
        options={teamsOptions}
      />
      <CustomFilter
        type="medium"
        selectedOption={innings}
        setSelectedOption={(innings) =>
          filterDispatcher({
            type: "setInnings",
            payload: { innings: innings, prevData: apiData },
          })
        }
        options={inningsOptions}
      />
    </div>
  );
};
