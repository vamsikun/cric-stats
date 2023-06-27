import { useState } from "react";
export function SummaryTable({ isBowlingSelected, seasonSelected }) {
  let statsFor = "bowler";
  if (!isBowlingSelected) {
    statsFor = "bowler";
  }
  async function getData() {
    const response = await fetch(
      `http://localhost:8000/${statsFor}/mostWickets/?season=${seasonSelected.season}`
    );
    const json = await response.json();
    setData(json);
  }
  getData();
  return (
    <>
      <div>Hello World</div>
      {console.log(data)}
    </>
  );
}
