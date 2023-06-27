"use client";
import DoubleButton from "./DoubleButton";
import { Filter } from "./Filter";
import { useState, useEffect, useLayoutEffect } from "react";
import { seasons, battingStats, bowlingStats } from "@/data";

export function Summary() {
  const [isBowlingSelected, setIsBowlingSelected] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(seasons[1]);
  const [stats, setStats] = useState(battingStats);
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [data, setData] = useState();

  useEffect(() => {
    console.log(selectedStat);
    if (isBowlingSelected) {
      setStats(bowlingStats);
      setSelectedStat(bowlingStats[0]);
    } else {
      setStats(battingStats);
      setSelectedStat(battingStats[0]);
    }
  }, [isBowlingSelected]);

  useEffect(() => {
    let ignore = false;
    let statsFor = "bowler";
    if (!isBowlingSelected) {
      statsFor = "batter";
    }

    fetch(
      `http://127.0.0.1:8000/${statsFor}/${selectedStat.apiValue}/?season=${selectedSeason.apiValue}`
    )
      .then((response) => response.json())
      .then((result) => {
        if (!ignore) {
          setData(result);
          console.log(result);
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
    </>
  );
}
