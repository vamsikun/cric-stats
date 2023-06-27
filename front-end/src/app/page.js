"use client";
import DoubleButton from "@/components/DoubleButton";
import { Filter } from "@/components/Filter";
import { SummaryTable } from "@/components/SummaryTable";
import { useState } from "react";

const seasons = [
  { id: 1, season: "2023" },
  { id: 2, season: "2022" },
  { id: 3, season: "2021" },
  { id: 4, season: "2020" },
  { id: 5, season: "2019" },
  { id: 6, season: "2018" },
  { id: 7, season: "2017" },
  { id: 8, season: "2016" },
  { id: 9, season: "2015" },
  { id: 10, season: "2014" },
];

// TODO:
// 1. optimize the use client
// 2. makes season async

export default function Home() {
  const [isBowlingSelected, setIsBowlingSelected] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(seasons[1]);
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
      />
    </>
  );
}
