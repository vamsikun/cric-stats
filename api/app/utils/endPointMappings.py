from schemas import batterSchemas, bowlerSchemas
from pydantic import BaseModel
from typing import Type, TypedDict, Callable
from getSQLScripts.batter.getSQLForBatterMostRuns import getSQLForBatterMostRuns
from getSQLScripts.batter.getSQLForBatterBestStrikeRate import (
    getSQLForBatterBestStrikeRate,
)
from getSQLScripts.batter.getSQLForBatterBestHighScore import (
    getSQLForBatterBestHighScore,
)
from getSQLScripts.batter.getSQLForBatterMostSixes import getSQLForBatterMostSixes
from getSQLScripts.batter.getSQLForBatterMostFours import getSQLForBatterMostFours
from getSQLScripts.batter.getSQLForBatterBestAverage import (
    getSQLForBatterBestAverage,
)

from getSQLScripts.bowler.getSQLForBowlerMostWickets import (
    getSQLForBowlerMostWickets,
)
from getSQLScripts.bowler.getSQLForBowlerBestAverage import getSQLForBowlerBestAverage
from getSQLScripts.bowler.getSQLForBowlerBestStrikeRate import (
    getSQLForBowlerBestStrikeRate,
)
from getSQLScripts.bowler.getSQLForBowlerBestEconomy import getSQLForBowlerBestEconomy
from getSQLScripts.bowler.getSQLForBowlerBestDotsPercentage import (
    getSQLForBowlerBestDotsPercentage,
)

havingClauseMappings: dict[str,str] = {
    "":"",
    "SUM(runs)>=100": "minimum 100 runs scored",
    "SUM(legal_deliveries)>=60": "minimum 60 deliveries"
}

class ApiMapping(TypedDict):
    endPoint: str
    columnName: str
    schema: Type[BaseModel]
    getSQLMethod: Callable
    havingClause: str
    description: str


batterApiMappings: dict[str, ApiMapping] = {
    # NOTE:
    # first element is used in the api endpoint path
    # second element is the name of the column on which the filter takes place
    # this can be used to get the selected filter column number in the data
    "Most Runs": { "endPoint":"mostRuns", "columnName":"runs", "schema": batterSchemas.MostRuns, "getSQLMethod": getSQLForBatterMostRuns, "havingClause":"", "description": "Most Runs" },
    "Most Sixes": { "endPoint":"mostSixes", "columnName":"sixes", "schema": batterSchemas.MostSixes , "getSQLMethod": getSQLForBatterMostSixes,"havingClause":"", "description": "Most Sixes" },
    "Most Fours": { "endPoint":"mostFours", "columnName":"fours", "schema": batterSchemas.MostFours , "getSQLMethod": getSQLForBatterMostFours,"havingClause":"" ,"description": "Most Fours" },
    "Best HS": { "endPoint":"bestHighScore", "columnName":"hs", "schema": batterSchemas.BestHighScore , "getSQLMethod": getSQLForBatterBestHighScore,"havingClause":"" ,"description": "Best High Score" },
    "Best SR": { "endPoint":"bestStrikeRate", "columnName":"sr", "schema": batterSchemas.BestStrikeRate, "getSQLMethod": getSQLForBatterBestStrikeRate,"havingClause":"SUM(runs)>=100" ,"description": "Best Strike Rate (min 100runs)" },
    "Best AVG": { "endPoint":"bestAverage", "columnName":"avg", "schema": batterSchemas.BestAverage, "getSQLMethod": getSQLForBatterBestAverage,"havingClause":"SUM(runs)>=100" ,"description": "Best Average (min 100runs)" },
}

bowlerApiMappings: dict[str, ApiMapping] = {
    # NOTE:
    # first element is used in the api endpoint path
    # second element is the name of the column on which the filter takes place
    # this can be used to get the selected filter column number in the data
    "Most Wickets": { "endPoint":"mostWickets", "columnName":"wickets", "schema": bowlerSchemas.MostWickets , "getSQLMethod": getSQLForBowlerMostWickets, "havingClause":"", "description": "Most Wickets" },
    "Best Dot %": {"endPoint":"bestDotsPercentage", "columnName":"dots_percentage", "schema": bowlerSchemas.BestDotsPercentage, "getSQLMethod": getSQLForBowlerBestDotsPercentage, "havingClause":"SUM(legal_deliveries)>=60", "description": "Best Dot % (mmin 60balls)"},
    "Best AVG": { "endPoint":"bestAverage", "columnName":"avg", "schema": bowlerSchemas.BestAverage, "getSQLMethod": getSQLForBowlerBestAverage,"havingClause":"SUM(legal_deliveries)>=60", "description": "Best Average (min 60balls)" },
    "Best SR": { "endPoint":"bestStrikeRate", "columnName":"sr", "schema": bowlerSchemas.BestStrikeRate, "getSQLMethod": getSQLForBowlerBestStrikeRate,"havingClause":"SUM(legal_deliveries)>=60", "description": "Best Strike Rate (min 60balls)" },
    "Best ECON": { "endPoint":"bestEconomy", "columnName":"econ", "schema": bowlerSchemas.BestEcon, "getSQLMethod": getSQLForBowlerBestEconomy, "havingClause":"SUM(legal_deliveries)>=60", "description": "Best ECON (min 60balls)" },
}
