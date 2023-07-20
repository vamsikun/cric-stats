"use client";
import { useReducer } from "react";
import { TeamSummaryFilter } from "@/components/TeamSummaryFilter";
import {
  teamsOptions,
  inningsOptions,
  teamTypesOptions,
  teamSummaryTableEachColStyles,
} from "@/data";
import { SummaryTable } from "@/components/SummaryTable";
import { modifyScore } from "../utils/modifyScore";
import useSWR from "swr";

function fetcher(apiEndPoint) {
  return fetch(apiEndPoint)
    .then((res) => res.json())
    .then((result) => {
      result["data"].forEach((element) => {
        element["high_score"] = modifyScore(element["high_score"]);
        element["low_score"] = modifyScore(element["low_score"]);
      });
      return result;
    });
}

const filterReducer = (state, action) => {
  switch (action.type) {
    case "setTeamType":
      return {
        ...state,
        teamType: action.payload,
      };
    case "setTeam":
      return {
        ...state,
        team: action.payload,
      };
    case "setInnings":
      return {
        ...state,
        innings: action.payload,
      };
  }
};

export const TeamSummary = () => {
  const [filter, filterDispatch] = useReducer(filterReducer, {
    teamType: teamTypesOptions[0],
    team: teamsOptions[0],
    innings: inningsOptions[0],
  });

  let inningsQuery = "";
  let teamQuery = `team=${filter["team"].apiValue}&`;
  let teamType = `teamType=${filter["teamType"].apiValue}&`;
  if (filter["innings"].value != "Both Inns") {
    inningsQuery = `innings=${filter["innings"].apiValue}&`;
  }
  let apiEndPoint = `http://192.168.9.6:8000/match/teamSummary/?${teamType}${teamQuery}${inningsQuery}`;
  const { data, error, isLoading } = useSWR(apiEndPoint, fetcher);

  return (
    <>
      <TeamSummaryFilter filter={filter} filterDispatcher={filterDispatch} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SummaryTable
          data={data["data"]}
          metadata={data["metadata"]}
          columnMapIndex={2}
          summaryTableColStyles={teamSummaryTableEachColStyles}
        />
      )}
    </>
  );
};
