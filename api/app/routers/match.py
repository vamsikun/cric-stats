from typing import Annotated
from fastapi import APIRouter, Depends
from database import getCursorForPGDB
from getSQLScripts.matches.getSQLForTeamSummary import getSQLForTeamSummary
from utils.getSQLQuery import executeSQLQuery

matchRouter = APIRouter(prefix="/match", tags=['matches'])

@matchRouter.get("/teamSummary")
async def getTeamSummary(season='2023',team=1,teamType='self', innings=None, cursor=Depends(getCursorForPGDB)):
    sql = getSQLForTeamSummary(season,team,teamType, innings)
    return executeSQLQuery(sql, cursor, havingClause="DLS,N/R,Overs Reduced Matches not considered*")