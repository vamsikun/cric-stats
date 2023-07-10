"use client";
import { useState, useLayoutEffect, useReducer } from "react";
import { TeamSummaryFilter } from "@/components/TeamSummaryFilter";
import { DoubleButton } from "@/components/DoubleButton";
import {
  teamsOptions,
  inningsOptions,
  teamSummaryTableEachColStyles,
} from "@/data";
import { SummaryTable } from "@/components/SummaryTable";
import { modifyScore } from "../utils/modifyScore";

const apiReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      action["payload"]["data"].forEach((element) => {
        element["high_score"] = modifyScore(element["high_score"]);
        element["low_score"] = modifyScore(element["low_score"]);
      });
      return action.payload;
  }
  throw Error("Unknown action: " + action.type);
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "teamType":
      return {
        ...state,
        isOppSelected: action.payload,
      };
    case "team":
      return {
        ...state,
        team: action.payload,
      };
    case "innings":
      return {
        ...state,
        innings: action.payload,
      };
  }
};

export const TeamSummary = () => {
  const [filter, filterDispatch] = useReducer(filterReducer, {
    isOppSelected: false,
    team: teamsOptions[0],
    innings: inningsOptions[0],
  });
  const [apiResponse, apiResponseDispatch] = useReducer(apiReducer, undefined);

  useLayoutEffect(() => {
    let ignore = false;
    let inningsQuery = "";
    let teamQuery = `team=${filter["team"].apiValue}&`;
    let teamType = `teamType=${filter["isOppSelected"] ? "opp" : "self"}&`;
    if (filter["innings"].value != "Both Inns") {
      inningsQuery = `innings=${filter["innings"].apiValue}&`;
    }

    fetch(
      `http://192.168.9.6:8000/match/teamSummary/?${teamType}${teamQuery}${inningsQuery}`
    )
      .then((response) => response.json())
      .then((result) => {
        if (!ignore) {
          apiResponseDispatch({ type: "SET_DATA", payload: result });
        }
      });
  }, [filter]);

  return (
    <>
      <DoubleButton
        isRightSelected={filter["isOppSelected"]}
        setIsRightSelected={(isOppSelected) =>
          filterDispatch({ type: "teamType", payload: isOppSelected })
        }
        options={["Self", "Opp'n"]}
      />
      <TeamSummaryFilter
        filter={filter}
        filterDispatcher={filterDispatch}
        teamOptions={teamsOptions}
        inningsOptions={inningsOptions}
      />
      {apiResponse != undefined && (
        <SummaryTable
          data={apiResponse["data"]}
          metadata={apiResponse["metadata"]}
          columnMapIndex={2}
          summaryTableColStyles={teamSummaryTableEachColStyles}
        />
      )}
    </>
  );
};
