"use client";
import { useReducer } from "react";
import { TeamSummaryFilter } from "@/components/TeamSummaryFilter";
import {
  teamsOptions,
  inningsOptions,
  teamTypesOptions,
  teamSummaryTableEachColStyles,
  skeletonTableData,
  skeletonSummaryTableEachColStyles,
} from "@/data";
import { SummaryTable } from "@/components/SummaryTable";
import { modifyScore } from "../utils/modifyScore";
import useSWR from "swr";
import { TableTitle } from "./TableTitle";

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
        teamType: action.payload["teamType"],
        prevData: action.payload["prevData"],
      };
    case "setTeam":
      return {
        ...state,
        team: action.payload["team"],
        prevData: action.payload["prevData"],
      };
    case "setInnings":
      return {
        ...state,
        innings: action.payload["innings"],
        prevData: action.payload["prevData"],
      };
  }
};

export const TeamSummary = () => {
  const [filter, filterDispatch] = useReducer(filterReducer, {
    teamType: teamTypesOptions[0],
    team: teamsOptions[0],
    innings: inningsOptions[0],
    prevData: undefined,
  });

  let inningsQuery = "";
  let teamQuery = `team=${filter["team"].apiValue}&`;
  let teamType = `teamType=${filter["teamType"].apiValue}&`;
  if (filter["innings"].value != "Both Inns") {
    inningsQuery = `innings=${filter["innings"].apiValue}&`;
  }
  let apiEndPoint = `${process.env.NEXT_PUBLIC_DO_API_URL}/match/teamSummary/?${teamType}${teamQuery}${inningsQuery}`;
  const { data, error, isLoading } = useSWR(apiEndPoint, fetcher);

  return (
    <>
      <TableTitle body={"Team Performance"} />
      <TeamSummaryFilter
        apiData={data}
        filter={filter}
        filterDispatcher={filterDispatch}
      />
      {isLoading ? (
        filter["prevData"] == undefined ? (
          <SummaryTable
            apiData={skeletonTableData}
            columnMapIndex={3}
            summaryTableColStyles={skeletonSummaryTableEachColStyles}
            spinner={true}
          />
        ) : (
          <SummaryTable
            apiData={filter["prevData"]}
            columnMapIndex={2}
            summaryTableColStyles={teamSummaryTableEachColStyles}
            spinner={true}
          />
        )
      ) : (
        <SummaryTable
          apiData={data}
          columnMapIndex={2}
          summaryTableColStyles={teamSummaryTableEachColStyles}
          spinner={false}
        />
      )}
    </>
  );
};
