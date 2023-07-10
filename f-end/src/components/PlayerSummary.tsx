"use client";
import { DoubleButton } from "./DoubleButton";
import { PlayerSummaryFilter } from "./PlayerSummaryFilter";
import { SummaryTable } from "./SummaryTable";
import { useState, useEffect, useLayoutEffect } from "react";
import { seasons, battingStats, bowlingStats } from "@/data";
import { playerSummaryTableEachColStyles } from "../data";

export function PlayerSummary() {
  const [isBowlingSelected, setIsBowlingSelected] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const [stats, setStats] = useState(battingStats);
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [apiResponse, setApiResponse] = useState();

  useEffect(() => {
    if (isBowlingSelected) {
      setStats(bowlingStats);
      setSelectedStat(bowlingStats[0]);
    } else {
      setStats(battingStats);
      setSelectedStat(battingStats[0]);
    }
  }, [isBowlingSelected]);

  useLayoutEffect(() => {
    let ignore = false;
    let statsFor = "bowler";
    if (!isBowlingSelected) {
      statsFor = "batter";
    }

    fetch(
      `http://192.168.9.6:8000/${statsFor}/${selectedStat.apiValue}/?season=${selectedSeason.apiValue}`
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
  }, [isBowlingSelected, selectedSeason, selectedStat]);

  return (
    <>
      <DoubleButton
        isRightSelected={isBowlingSelected}
        setIsRightSelected={setIsBowlingSelected}
        options={["Batting", "Bowling"]}
      />
      <PlayerSummaryFilter
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        seasons={seasons}
        selectedStat={selectedStat}
        setSelectedStat={setSelectedStat}
        stats={stats}
      />
      {apiResponse != undefined && (
        <SummaryTable
          data={apiResponse["data"]}
          metadata={apiResponse["metadata"]}
          // this index is based on columnMaps array in data file
          columnMapIndex={isBowlingSelected ? 1 : 0}
          summaryTableColStyles={playerSummaryTableEachColStyles}
        />
      )}
    </>
  );
}
