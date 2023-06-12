from typing import Annotated
from fastapi import APIRouter, Depends
# NOTE: ignore the import not resolved errors here; as it would be fine as we execute it from the app directory
from database import getCursorForPGDB
from getSQLScripts.batter.getSQLForBatterMostRuns import getSQLForBatterMostRuns
from getSQLScripts.batter.getSQLForBatterHighestStrikeRate import getSQLForBatterHighestStrikeRate
from getSQLScripts.batter.getSQLForBatterHighScore import getSQLForBatterHighScore
from getSQLScripts.batter.getSQLForBatterMostSixes import getSQLForBatterMostSixes
from getSQLScripts.batter.getSQLForBatterMostFours import getSQLForBatterMostFours
from getSQLScripts.batter.getSQLForBatterHighestAverage import getSQLForBatterHighestAverage
from schemas import batterSchemas

batterRouter = APIRouter(prefix="/batter", tags=["batter"])


@batterRouter.get("/mostRuns",
                  response_model=list[batterSchemas.MostRuns],
                  description="Get the list of players with most runs")
async def mostRuns(season: Annotated[str | None, 'season'] = None,
                   team: Annotated[str | None, 'team'] = None,
                   innings: Annotated[int | None, 'innings'] = None,
                   opposition: Annotated[str |
                                         None, 'opposition'] = None,
                   cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterMostRuns(season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]


@batterRouter.get("/mostSixes",
                  response_model=list[batterSchemas.MostSixes],
                  description="Get the list of players with most sixes")
async def mostSixes(season: Annotated[str | None, 'season'] = None,
                    team: Annotated[str | None, 'team'] = None,
                    innings: Annotated[int | None, 'innings'] = None,
                    opposition: Annotated[str |
                                          None, 'opposition'] = None,
                    cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterMostSixes(season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]


@batterRouter.get("/mostFours",
                  response_model=list[batterSchemas.MostFours],
                  description="Get the list of players with most fours")
async def mostFours(season: Annotated[str | None, 'season'] = None,
                    team: Annotated[str | None, 'team'] = None,
                    innings: Annotated[int | None, 'innings'] = None,
                    opposition: Annotated[str |
                                          None, 'opposition'] = None,
                    cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterMostFours(season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]


@batterRouter.get("/highScore",
                  response_model=list[batterSchemas.HighScore],
                  description="Get the list of players with most fours")
async def highScore(season: Annotated[str | None, 'season'] = None,
                    team: Annotated[str | None, 'team'] = None,
                    innings: Annotated[int | None, 'innings'] = None,
                    opposition: Annotated[str |
                                          None, 'opposition'] = None,
                    cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterHighScore(season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]


@batterRouter.get("/highestStrikeRate",
                  response_model=list[batterSchemas.HighestStrikeRate],
                  description="Get the list of players with highest strike rate having minimum of 100 runs")
async def highestStrikeRate(season: Annotated[str | None, 'season'] = None,
                            team: Annotated[str | None, 'team'] = None,
                            innings: Annotated[int |
                                               None, 'innings'] = None,
                            opposition: Annotated[str |
                                                  None, 'opposition'] = None,
                            cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterHighestStrikeRate(
        season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]


@batterRouter.get("/highestAverage",
                  response_model=list[batterSchemas.HighestAverage],
                  description="Get the list of players with highest strike rate having minimum of 100 runs")
async def highestAverage(season: Annotated[str | None, 'season'] = None,
                         team: Annotated[str | None, 'team'] = None,
                         innings: Annotated[int |
                                            None, 'innings'] = None,
                         opposition: Annotated[str |
                                               None, 'opposition'] = None,
                         cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBatterHighestAverage(
        season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]
