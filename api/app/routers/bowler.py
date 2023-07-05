from fastapi import APIRouter, Depends
from typing import Annotated
from database import getCursorForPGDB
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
from schemas import bowlerSchemas
from utils.endPointMappings import bowlerApiMappings
from utils.executeSQLQuery import executeSQLQuery

bowlerRouter = APIRouter(prefix="/bowler", tags=["bowler"])


mostWicketsEndPointMap = 'Most Wickets'
@bowlerRouter.get(
    f"/{bowlerApiMappings[mostWicketsEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[bowlerSchemas.MostWickets]],
    description="Get the list of players with most wickets",
)
async def getMostWickets(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBowlerMostWickets(season, team, innings, opposition)
    filterOn = bowlerApiMappings[mostWicketsEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

dotsPercentageEndPointMap = 'Best Dot %'
@bowlerRouter.get(
    f"/{bowlerApiMappings[dotsPercentageEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[bowlerSchemas.BestDotsPercentage]],
    description="Get the list of players with Best Dot Balls Percentage",
)
async def getBestDotsPercentage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBowlerBestDotsPercentage(season, team, innings, opposition)
    filterOn = bowlerApiMappings[dotsPercentageEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

bestAverageEndPointMap = 'Best AVG'
@bowlerRouter.get(
    f"/{bowlerApiMappings[bestAverageEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[bowlerSchemas.BestAverage]],
    description="Get the list of players with best average",
)
async def getBestAverage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBowlerBestAverage(season, team, innings, opposition)
    filterOn = bowlerApiMappings[bestAverageEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

bestEconomyEndPointMap = 'Best ECON'
@bowlerRouter.get(
    f"/{bowlerApiMappings[bestEconomyEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[bowlerSchemas.MostWickets]],
    description="Get the list of players with best economy",
)
async def getBestEconomy(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBowlerBestEconomy(season, team, innings, opposition)
    filterOn = bowlerApiMappings[bestEconomyEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)

bestStrikeRateEndPointMap = 'Best SR'
@bowlerRouter.get(
    f"/{bowlerApiMappings[bestStrikeRateEndPointMap]['endPoint']}",
    response_model=dict[str,str|list[bowlerSchemas.BestStrikeRate]],
    description="Get the list of players with best strike rate",
)
async def getBestStrikeRate(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    cursor=Depends(getCursorForPGDB),
):
    sqlQuery = getSQLForBowlerBestStrikeRate(season, team, innings, opposition)
    filterOn = bowlerApiMappings[bestStrikeRateEndPointMap]['columnName']
    return executeSQLQuery(sqlQuery, cursor, filterOn)