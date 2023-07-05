from typing import Annotated
from fastapi import APIRouter, Depends

# NOTE: ignore the import not resolved errors here; as it would be fine as we execute it from the app directory
from database import getCursorForPGDB
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
from schemas import batterSchemas
from utils.endPointMappings import batterApiMappings
from utils.executeSQLQuery import executeSQLQuery

batterRouter = APIRouter(prefix="/batter", tags=["batter"])


mostRunsEndPointMap = 'Most Runs'
@batterRouter.get(
    f"/{batterApiMappings[mostRunsEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.MostRuns]],
    description="Get the list of players with most runs",
)
async def mostRuns(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterMostRuns(season, team, innings, opposition)
    filterOn = batterApiMappings[mostRunsEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

mostSixesEndPointMap = 'Most Sixes'
@batterRouter.get(
    f"/{batterApiMappings[mostSixesEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.MostSixes]],
    description="Get the list of players with most sixes",
)
async def mostSixes(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterMostSixes(season, team, innings, opposition)
    filterOn = batterApiMappings[mostSixesEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

mostFoursEndPointMap = 'Most Fours'
@batterRouter.get(
    f"/{batterApiMappings[mostFoursEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.MostFours]],
    description="Get the list of players with most fours",
)
async def mostFours(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterMostFours(season, team, innings, opposition)
    filterOn = batterApiMappings[mostFoursEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor,filterOn)
    

bestHighScoreEndPointMap = 'Best HS'
@batterRouter.get(
    f"/{batterApiMappings[bestHighScoreEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.BestHighScore]],
    description="Get the list of players who has the best high score",
)
async def getBestHighScore(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterBestHighScore(season, team, innings, opposition)
    filterOn = batterApiMappings[bestHighScoreEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

bestStrikeRateEndPointMap = 'Best SR'
@batterRouter.get(
    f"/{batterApiMappings[bestStrikeRateEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.BestStrikeRate]],
    description="Get the list of players with highest strike rate having minimum of 100 runs",
)
async def bestStrikeRate(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterBestStrikeRate(season, team, innings, opposition)
    filterOn = batterApiMappings[bestStrikeRateEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

bestAverageEndPointMap = 'Best AVG'
@batterRouter.get(
    f"/{batterApiMappings[bestAverageEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[batterSchemas.BestAverage]],
    description="Get the list of players with highest strike rate having minimum of 100 runs",
)
async def bestAverage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBatterBestAverage(season, team, innings, opposition)
    filterOn = batterApiMappings[bestAverageEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor,filterOn)
