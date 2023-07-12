export type selectOption = {
  id: number;
  value: string;
  apiValue: string | number;
  metadata?: string;
};

export const seasons: selectOption[] = [
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

export const teamsOptions: selectOption[] = [
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

export const inningsOptions: selectOption[] = [
  { id: 1, value: "Both Inns", apiValue: 0 },
  { id: 2, value: "First Inns", apiValue: 1 },
  { id: 3, value: "Second Inns", apiValue: 2 },
];

export const playerTypes: selectOption[] = [
  { id: 1, value: "Batting", apiValue: "batter" },
  { id: 2, value: "Bowling", apiValue: "bowler" },
];

export const battingStats: selectOption[] = [
  { id: 1, value: "Most Runs", apiValue: "mostRuns" },
  { id: 2, value: "Best HS", apiValue: "bestHighScore" },
  { id: 3, value: "Best Strike Rate", apiValue: "bestStrikeRate" },
  { id: 4, value: "Best Average", apiValue: "bestAverage" },
  { id: 5, value: "Most Fours", apiValue: "mostFours" },
  { id: 6, value: "Most Sixes", apiValue: "mostSixes" },
];

export const bowlingStats: selectOption[] = [
  { id: 1, value: "Most Wickets", apiValue: "mostWickets" },
  { id: 2, value: "Best Dot %", apiValue: "bestDotsPercentage" },
  { id: 3, value: "Best Economy", apiValue: "bestEconomy" },
  { id: 4, value: "Best Strike Rate", apiValue: "bestStrikeRate" },
  { id: 5, value: "Best Average", apiValue: "bestAverage" },
];

export const teamTypesOptions: selectOption[] = [
  { id: 1, value: "Self", apiValue: "self" },
  { id: 2, value: "Opp'n", apiValue: "opp" },
];

export const batterColumnMaps = {
  pos: "POS",
  player: "PLAYER",
  team: "TEAM",
  opposition: "OPP",
  matches: "MAT",
  innings: "INNS",
  runs: "RUNS",
  hs: "HS",
  sr: "SR",
  avg: "AVG",
  sixes: "6S",
  fours: "4S",
};

export const bowlerColumnMaps = {
  pos: "POS",
  player: "PLAYER",
  matches: "MAT",
  innings: "INNS",
  overs: "OV",
  dots_percentage: "DOT %",
  wickets: "WKTS",
  runs: "RUNS",
  sr: "SR",
  avg: "AVG",
  econ: "ECON",
};

export const teamSummaryColumnMaps = {
  season: "SEASON",
  matches: "#",
  w_l: "W/L",
  high_score: "HS",
  low_score: "LS *",
  wickets: "WKTS",
  fours: "4S",
  sixes: "6S",
  run_rate: "RR",
};

export const columnMaps = [
  batterColumnMaps,
  bowlerColumnMaps,
  teamSummaryColumnMaps,
];

export const playerSummaryTableEachColStyles = {
  // NOTE: width of the columns is being set here;
  // these value are picked up in such a way that the width can occupy the max-length content
  // for small screen sizes, wrapping is allowed
  // 0. Position; 1. Player Name
  headerCols: {
    "0": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[2.5rem] sm:min-w-[3rem] sticky left-0 z-40",
    // NOTE: for player name column I am also setting the max-width as the player name lengths can vary a lot so fixing this width
    "1": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 pl-2 text-left sticky left-[2.5rem] sm:left-[3rem] z-20 max-w-[7rem] min-w-[7rem] sm:max-w-[11rem] sm:min-w-[11rem] before:absolute before:-right-0.5 sm:before:-right-1 before:top-0 before:w-0.5 sm:before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300",
    // to cover the extra width lost because of the pseudo element
    "2": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[4.125rem] sm:min-w-[4.75rem]",
    other:
      "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[4rem] sm:min-w-[4.5rem]",
    selectedCol: "bg-teal-600",
  },
  cellCols: {
    // NOTE: for the width of these elements look at the width of the header column
    // these elements min-width is being set there
    "0": "text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 text-center sticky left-0",
    "1": "font-semibold text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 pl-2 text-left sticky left-[2.5rem] sm:left-[3rem]  sm:overflow-ellipsis sm:whitespace-nowrap before:absolute before:-right-0.5 sm:before:-right-1 before:top-0 before:w-0.5 sm:before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300",
    other: "text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 text-center",
    selectedCol: "bg-teal-200",
  },
};

export const teamSummaryTableEachColStyles = {
  // NOTE: width of the columns is being set here;
  // these value are picked up in such a way that the width can occupy the max-length content
  // for small screen sizes, wrapping is allowed
  // 0.Season 1.Number of Matches 2.W/L 3.HS 4.LS
  headerCols: {
    "0": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[3.25rem] sm:min-w-[3.75rem] sticky left-0 z-40",
    // NOTE: for player name column I am also setting the max-width as the player name lengths can vary a lot so fixing this width
    "1": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 pl-2 sticky left-[3.25rem] sm:left-[3.75rem] z-20 min-w-[2.5rem] sm:min-w-[3rem]",
    "2": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 pl-2 sticky left-[5.75rem] sm:left-[6.75rem] z-20 min-w-[2.5rem] sm:min-w-[3rem] before:absolute before:-right-0.5 sm:before:-right-1 before:top-0 before:w-0.5 sm:before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300",
    // to cover the extra width lost because of the pseudo element
    "3": "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[4.125rem] sm:min-w-[4.75rem]",
    other:
      "font-medium text-xs py-1 sm:py-1.5 bg-teal-300 min-w-[4rem] sm:min-w-[4.5rem]",
    selectedCol: "bg-teal-600",
  },
  cellCols: {
    // NOTE: for the width of these elements look at the width of the header column
    // these elements min-width is being set there
    "0": "text-sm sm:text-base font-semibold py-1.5 sm:py-2 bg-teal-100 text-center sticky left-0",
    "1": "text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 pl-2 text-center sticky left-[3.25rem] sm:left-[3.75rem]  sm:overflow-ellipsis sm:whitespace-nowrap",
    "2": "text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 pl-2 text-center sticky left-[5.75rem] sm:left-[6.75rem]  sm:overflow-ellipsis sm:whitespace-nowrap before:absolute before:-right-0.5 sm:before:-right-1 before:top-0 before:w-0.5 sm:before:w-1 before:h-full before:bg-gradient-to-r before:from-gray-400 before:to-gray-300",
    other: "text-sm sm:text-base py-1.5 sm:py-2 bg-teal-100 text-center",
    selectedCol: "bg-teal-200",
  },
};

// class = "font-"
