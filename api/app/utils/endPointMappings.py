batterApiMappings = {
    # NOTE:
    # first element is used in the api endpoint path
    # second element is the name of the column on which the filter takes place
    # this can be used to get the selected filter column number in the data
    "Most Runs": { "endPoint":"mostRuns", "columnName":"runs" },
    "Most Sixes": { "endPoint":"mostSixes", "columnName":"sixes" },
    "Most Fours": { "endPoint":"mostFours", "columnName":"fours" },
    "Best HS": { "endPoint":"bestHighScore", "columnName":"hs" },
    "Best SR": { "endPoint":"bestStrikeRate", "columnName":"sr" },
    "Best AVG": { "endPoint":"bestAverage", "columnName":"avg" },
}

bowlerApiMappings = {
    # NOTE:
    # first element is used in the api endpoint path
    # second element is the name of the column on which the filter takes place
    # this can be used to get the selected filter column number in the data
    "Most Wickets": { "endPoint":"mostWickets", "columnName":"wickets" },
    "Best Dot %": {"endPoint":"bestDotsPercentage", "columnName":"dots_percentage" },
    "Best AVG": { "endPoint":"bestAverage", "columnName":"avg" },
    "Best SR": { "endPoint":"bestStrikeRate", "columnName":"sr" },
    "Best ECON": { "endPoint":"bestEconomy", "columnName":"econ" },
}
