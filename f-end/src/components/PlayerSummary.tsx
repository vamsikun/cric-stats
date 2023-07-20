"use client";
import { PlayerSummaryFilter } from "./PlayerSummaryFilter";
import { SummaryTable } from "./SummaryTable";
import { useReducer } from "react";
import { seasons, playerTypes, battingStats, bowlingStats } from "@/data";
import { playerSummaryTableEachColStyles } from "../data";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcherForSWR";

// create a reducer function for multiple states
function filterReducer(state, action) {
  switch (action.type) {
    case "setSeason":
      return { ...state, season: action.payload["season"] };
    case "setPlayerType":
      if (action.payload["playerType"].apiValue == "bowler") {
        return {
          ...state,
          playerType: action.payload["playerType"],
          stats: bowlingStats,
          selectedStat: bowlingStats[0],
        };
      } else {
        return {
          ...state,
          playerType: action.payload["playerType"],
          stats: battingStats,
          selectedStat: battingStats[0],
        };
      }
    case "setSelectedStat":
      return { ...state, selectedStat: action.payload["stat"] };
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
  });

  const endPoint = `http://192.168.9.6:8000/${state["playerType"].apiValue}/${state["selectedStat"].apiValue}/?season=${state["season"].apiValue}`;
  const { data, error, isLoading } = useSWR(endPoint, fetcher);

  return (
    <>
      <PlayerSummaryFilter filters={state} filterDispatcher={dispatch} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SummaryTable
          data={data["data"]}
          metadata={data["metadata"]}
          // this index is based on columnMaps array in data file
          columnMapIndex={state["playerType"].apiValue == "bowler" ? 1 : 0}
          summaryTableColStyles={playerSummaryTableEachColStyles}
        />
      )}
    </>
  );
}
