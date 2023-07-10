export type eachCellInTable = {
  id: number;
  value: string;
  apiValue: string | number;
  metadata?: string;
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

export const teams: eachCellInTable[] = [
  { id: 1, value: "RCB", apiValue: 1, metadata: "Royal Challengers Bangalore" },
  { id: 2, value: "DC", apiValue: 2, metadata: "Delhi Capitals" },
  { id: 3, value: "CSK", apiValue: 3, metadata: "Chennai Super Kings" },
  { id: 4, value: "KKR", apiValue: 4, metadata: "Kolkata Knight Riders" },
  { id: 5, value: "RR", apiValue: 5, metadata: "Rajasthan Royals" },
  { id: 6, value: "SRH", apiValue: 6, metadata: "Sunrisers Hyderabad" },
  { id: 7, value: "PWI", apiValue: 7, metadata: "Pune Warriors India" },
  { id: 8, value: "RPS", apiValue: 8, metadata: "Rising Pune Supergiants" },
  { id: 9, value: "LSG", apiValue: 9, metadata: "Lucknow Super Giants" },
  { id: 10, value: "KXIP", apiValue: 10, metadata: "Kings XI Punjab" },
  { id: 11, value: "MI", apiValue: 11, metadata: "Mumbai Indians" },
  { id: 12, value: "GT", apiValue: 12, metadata: "Gujarat Titans" },
  { id: 13, value: "GL", apiValue: 13, metadata: "Gujarat Lions" },
  { id: 14, value: "KTK", apiValue: 14, metadata: "Kochi Tuskers Kerala" },
  { id: 15, value: "DCH", apiValue: 15, metadata: "Deccan Chargers" },
];

export const battingStats: eachCellInTable[] = [
  { id: 1, value: "Most Runs", apiValue: "mostRuns" },
  { id: 2, value: "Best HS", apiValue: "bestHighScore" },
  { id: 3, value: "Best Strike Rate", apiValue: "bestStrikeRate" },
  { id: 4, value: "Best Average", apiValue: "bestAverage" },
  { id: 5, value: "Most Fours", apiValue: "mostFours" },
  { id: 6, value: "Most Sixes", apiValue: "mostSixes" },
];

export const bowlingStats: eachCellInTable[] = [
  { id: 1, value: "Most Wickets", apiValue: "mostWickets" },
  { id: 2, value: "Best Dot %", apiValue: "bestDotsPercentage" },
  { id: 3, value: "Best Economy", apiValue: "bestEconomy" },
  { id: 4, value: "Best Strike Rate", apiValue: "bestStrikeRate" },
  { id: 5, value: "Best Average", apiValue: "bestAverage" },
];
