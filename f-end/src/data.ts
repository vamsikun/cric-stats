export type eachCellInTable = {
  id: number;
  value: string;
  apiValue: string;
};

export const seasons: eachCellInTable[] = [
  // TODO: modify this so the value get automatically populated from the server
  { id: 1, value: "2023", apiValue: "2023" },
  { id: 2, value: "2022", apiValue: "2022" },
  { id: 3, value: "2021", apiValue: "2021" },
  { id: 4, value: "2020", apiValue: "2020" },
  { id: 5, value: "2019", apiValue: "2019" },
  { id: 6, value: "2018", apiValue: "2018" },
  { id: 7, value: "2017", apiValue: "2017" },
  { id: 8, value: "2016", apiValue: "2016" },
  { id: 9, value: "2015", apiValue: "2015" },
  { id: 10, value: "2014", apiValue: "2014" },
  { id: 11, value: "2013", apiValue: "2013" },
  { id: 12, value: "2012", apiValue: "2012" },
  { id: 13, value: "2011", apiValue: "2011" },
  { id: 14, value: "2010", apiValue: "2010" },
  { id: 15, value: "2009", apiValue: "2009" },
  { id: 16, value: "2008", apiValue: "2008" },
];

export const battingStats: eachCellInTable[] = [
  { id: 1, value: "Most Runs", apiValue: "mostRuns" },
  { id: 2, value: "Most Sixes", apiValue: "mostSixes" },
  { id: 3, value: "Most Fours", apiValue: "mostFours" },
  { id: 4, value: "Best Strike Rate", apiValue: "highestStrikeRate" },
  { id: 5, value: "Best Average", apiValue: "highestAverage" },
];

export const bowlingStats: eachCellInTable[] = [
  { id: 1, value: "Most Wickets", apiValue: "mostWickets" },
  { id: 2, value: "Best Average", apiValue: "bestAverage" },
  { id: 3, value: "Best Economy", apiValue: "bestEconomy" },
  { id: 4, value: "Best Strike Rate", apiValue: "bestStrikeRate" },
];
