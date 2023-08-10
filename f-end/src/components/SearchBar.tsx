"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Combobox } from "@headlessui/react";

export function SearchBar() {
  // check if we can use the form element with GET
  const [players, setPlayers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DO_API_URL}/player/`)
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        result["player"] = result["player"].map((element) => element[0]);
        setPlayers(result["player"]);
        setIsLoading(false);
      });
  }, []);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [query, setQuery] = useState("");
  const filteredPeople =
    query === ""
      ? players
      : players.filter((player) => {
          return player.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Combobox value={selectedPlayer} onChange={setSelectedPlayer}>
        <Combobox.Input
          onChange={(event) => !isLoading && setQuery(event.target.value)}
        />
        {!isLoading && (
          <Combobox.Options>
            {filteredPeople.map((person) => (
              <Combobox.Option key={person} value={person}>
                {person}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox>
      {/* <div className="flex justify-center">
        <div className="relative flex flex-row-reverse justify-center rounded-md overflow-clip">
          <input className="w-44 outline-none bg-slate-700 h-8" />
          <div className="bg-slate-700">
            <svg
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="py-1 ml-2 flex-none text-slate-500"
              aria-hidden="true"
            >
              <path d="m19 19-3.5-3.5"></path>
              <circle cx="11" cy="11" r="6"></circle>
            </svg>
          </div>
        </div>
      </div> */}
    </>
  );
}
