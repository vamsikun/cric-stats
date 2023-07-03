"use client";
import { DoubleButton } from "./DoubleButton";
import { Filter } from "./Filter";
import { SummaryTable } from "./SummaryTable";
import { useState, useEffect, useLayoutEffect } from "react";
import { seasons, battingStats, bowlingStats } from "@/data";

export function Summary() {
  const [isBowlingSelected, setIsBowlingSelected] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(seasons[1]);
  const [stats, setStats] = useState(battingStats);
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [data, setData] = useState();

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
          setData(result);
        }
      });
    return () => {
      ignore = true;
    };
  }, [isBowlingSelected, selectedSeason, selectedStat]);

  return (
    <>
      <DoubleButton
        isBowlingSelected={isBowlingSelected}
        setIsBowlingSelected={setIsBowlingSelected}
      />
      <Filter
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        seasons={seasons}
        selectedStat={selectedStat}
        setSelectedStat={setSelectedStat}
        stats={stats}
      />
      {data === undefined ? null : (
        <SummaryTable data={data} isBowlingSelected={isBowlingSelected} />
      )}
    </>
  );
}
