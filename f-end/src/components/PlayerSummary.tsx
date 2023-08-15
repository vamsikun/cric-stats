"use client";
import { PlayerSummaryFilter } from "./PlayerSummaryFilter";
import { SummaryTable } from "./SummaryTable";
import { useReducer } from "react";
import { seasons, playerTypes, battingStats, bowlingStats } from "@/data";
import {
  playerSummaryTableEachColStyles,
  skeletonSummaryTableEachColStyles,
  skeletonTableData,
} from "../data";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcherForSWR";
import { TableTitle } from "./TableTitle";

// create a reducer function for multiple states
function filterReducer(state, action) {
  switch (action.type) {
    case "setSeason":
      return {
        ...state,
        season: action.payload["season"],
        prevData: action.payload["prevData"],
      };
    case "setPlayerType":
      if (action.payload["playerType"].apiValue == "bowler") {
        return {
          ...state,
          playerType: action.payload["playerType"],
          stats: bowlingStats,
          selectedStat: bowlingStats[0],
          prevData: action.payload["prevData"],
        };
      } else {
        return {
          ...state,
          playerType: action.payload["playerType"],
          stats: battingStats,
          selectedStat: battingStats[0],
          prevData: action.payload["prevData"],
        };
      }
    case "setSelectedStat":
      return {
        ...state,
        selectedStat: action.payload["stat"],
        prevData: action.payload["prevData"],
      };
    default:
      throw new Error();
  }
}

export function PlayerSummary() {
  const [state, dispatch] = useReducer(filterReducer, {
    season: seasons[0],
    playerType: playerTypes[0],
    stats: battingStats,
    selectedStat: battingStats[0],
    prevData: undefined,
  });

  const endPoint = `https://sea-turtle-app-elqvq.ondigitalocean.app/${state["playerType"].apiValue}/${state["selectedStat"].apiValue}?season=${state["season"].apiValue}`;
  console.log(endPoint);
  const { data, error, isLoading } = useSWR(endPoint, fetcher);

  return (
    <>
      <TableTitle body={"Top Performers"} />
      <PlayerSummaryFilter
        apiData={data}
        filters={state}
        filterDispatcher={dispatch}
      />
      { isLoading ? (
        state["prevData"] == undefined ? (
          <SummaryTable
            apiData={skeletonTableData}
            // this index is based on columnMaps array in data file
            columnMapIndex={3}
            summaryTableColStyles={skeletonSummaryTableEachColStyles}
            spinner={true}
          />
        ) : (
          <SummaryTable
            apiData={state["prevData"]}
            // this index is based on columnMaps array in data file
            columnMapIndex={state["playerType"].apiValue == "bowler" ? 1 : 0}
            summaryTableColStyles={playerSummaryTableEachColStyles}
            spinner={true}
          />
        )
      ) : (
        <SummaryTable
          apiData={data}
          // this index is based on columnMaps array in data file
          columnMapIndex={state["playerType"].apiValue == "bowler" ? 1 : 0}
          summaryTableColStyles={playerSummaryTableEachColStyles}
          spinner={false}
        />
      )}
    </>
  );
}
