from fastapi import APIRouter, Depends
from typing import Annotated
from database import getCursorForPGDB
from getSQLScripts.bowler.getSQLForBowlerHighestWickets import getSQLForBowlerHighestWickets
from getSQLScripts.bowler.getSQLForBowlerBestAverage import getSQLForBowlerBestAverage
from getSQLScripts.bowler.getSQLForBowlerBestStrikeRate import getSQLForBowlerBestStrikeRate
from getSQLScripts.bowler.getSQLForBowlerBestEconomy import getSQLForBowlerBestEconomy
from schemas import bowlerSchemas

bowlerRouter = APIRouter(prefix="/bowler", tags=["bowler"])


@bowlerRouter.get("/mostWickets",
                  response_model=list[bowlerSchemas.MostWickets],
                  description="Get the list of players with most wickets")
async def getMostWickets(
                   season: Annotated[str | None, 'season'] = None,
                   team: Annotated[str | None, 'team'] = None,
                   innings: Annotated[int | None, 'innings'] = None,
                   opposition: Annotated[str |
                                         None, 'opposition'] = None,cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSQLForBowlerHighestWickets(season, team, innings, opposition))
    players = cursor.fetchall()
    columnNames = [desc[0] for desc in cursor.description]
    return [dict(zip(columnNames, player)) for player in players]

@bowlerRouter.get("/bestAverage",
                  response_model=list[bowlerSchemas.BestAverage],
                  description="Get the list of players with best average")
async def getBestAverage(season: Annotated[str|None,'season']=None,
                     team: Annotated[str|None,'team']=None,
                     innings: Annotated[int|None,'innings']=None,
                     opposition: Annotated[str|None,'opposition']=None,cursor=Depends(getCursorForPGDB)):
     cursor.execute(getSQLForBowlerBestAverage(season, team, innings, opposition))
     players = cursor.fetchall()
     columnNames = [desc[0] for desc in cursor.description]
     return [dict(zip(columnNames, player)) for player in players]

@bowlerRouter.get("/bestEconomy",
                  response_model=list[bowlerSchemas.BestEcon],
                  description="Get the list of players with best economy")
async def getBestEconomy(season: Annotated[str|None,'season']=None,
                        team: Annotated[str|None,'team']=None,
                        innings: Annotated[int|None,'innings']=None,
                        opposition: Annotated[str|None,'opposition']=None,cursor=Depends(getCursorForPGDB)):
        cursor.execute(getSQLForBowlerBestEconomy(season, team, innings, opposition))
        players = cursor.fetchall()
        columnNames = [desc[0] for desc in cursor.description]
        return [dict(zip(columnNames, player)) for player in players]

@bowlerRouter.get("/bestStrikeRate",
            response_model=list[bowlerSchemas.BestStrikeRate],
            description="Get the list of players with best strike rate")
async def getBestStrikeRate(season: Annotated[str|None,'season']=None,
                        team: Annotated[str|None,'team']=None,
                        innings: Annotated[int|None,'innings']=None,
                        opposition: Annotated[str|None,'opposition']=None,cursor=Depends(getCursorForPGDB)):
        cursor.execute(getSQLForBowlerBestStrikeRate(season, team, innings, opposition))
        players = cursor.fetchall()
        columnNames = [desc[0] for desc in cursor.description]
        return [dict(zip(columnNames, player)) for player in players]
