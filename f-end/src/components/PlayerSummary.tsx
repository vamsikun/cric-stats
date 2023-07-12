"use client";
import { PlayerSummaryFilter } from "./PlayerSummaryFilter";
import { SummaryTable } from "./SummaryTable";
import { useState, useEffect, useLayoutEffect } from "react";
import { seasons, playerTypes, battingStats, bowlingStats } from "@/data";
import { playerSummaryTableEachColStyles } from "../data";

export function PlayerSummary() {
  const [selectedPlayerType, setSelectedPlayerType] = useState(playerTypes[0]);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const [stats, setStats] = useState(battingStats);
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [apiResponse, setApiResponse] = useState();

  useEffect(() => {
    if (selectedPlayerType.apiValue == "bowler") {
      setStats(bowlingStats);
      setSelectedStat(bowlingStats[0]);
    } else {
      setStats(battingStats);
      setSelectedStat(battingStats[0]);
    }
  }, [selectedPlayerType]);

  useLayoutEffect(() => {
    let ignore = false;

    fetch(
      `http://192.168.9.6:8000/${selectedPlayerType.apiValue}/${selectedStat.apiValue}/?season=${selectedSeason.apiValue}`
    )
      .then((response) => response.json())
      .then((result) => {
        if (!ignore) {
          setApiResponse(result);
        }
      });
    return () => {
      ignore = true;
    };
  }, [selectedPlayerType, selectedSeason, selectedStat]);

  return (
    <>
      <PlayerSummaryFilter
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        seasons={seasons}
        selectedStat={selectedStat}
        setSelectedStat={setSelectedStat}
        stats={stats}
        selectedPlayerType={selectedPlayerType}
        setSelectedPlayerType={setSelectedPlayerType}
        playerTypes={playerTypes}
      />
      {apiResponse != undefined ? (
        <SummaryTable
          data={apiResponse["data"]}
          metadata={apiResponse["metadata"]}
          // this index is based on columnMaps array in data file
          columnMapIndex={selectedPlayerType.apiValue == "bowler" ? 1 : 0}
          summaryTableColStyles={playerSummaryTableEachColStyles}
        />
      ) : null}
    </>
  );
}
