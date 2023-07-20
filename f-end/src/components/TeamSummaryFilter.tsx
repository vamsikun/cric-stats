import { CustomFilter } from "@/components/CustomFilter";
import { teamTypesOptions, teamsOptions, inningsOptions } from "@/data";
export const TeamSummaryFilter = ({ filter, filterDispatcher }) => {
  const team = filter["team"];
  const innings = filter["innings"];
  const teamType = filter["teamType"];
  return (
    <div className="mt-8 flex gap-1 justify-center items-center">
      <CustomFilter
        type="small"
        selectedOption={teamType}
        setSelectedOption={(teamType) =>
          filterDispatcher({ type: "setTeamType", payload: teamType })
        }
        options={teamTypesOptions}
      />
      <CustomFilter
        type="small"
        selectedOption={team}
        setSelectedOption={(team) =>
          filterDispatcher({ type: "setTeam", payload: team })
        }
        options={teamsOptions}
      />
      <CustomFilter
        type="large"
        selectedOption={innings}
        setSelectedOption={(innings) =>
          filterDispatcher({ type: "setInnings", payload: innings })
        }
        options={inningsOptions}
      />
    </div>
  );
};
