from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
import json

from database import getCursorForPGDB, rd
from getSQLScripts.matches.getSQLForTeamSummary import getSQLForTeamSummary
from utils.getSQLQuery import executeSQLQuery

matchRouter = APIRouter(prefix="/match", tags=['matches'])
#TODO: add type validations for endpoints
@matchRouter.get("/teamSummary")
async def getTeamSummary(season='2023',team=1,teamType='self', innings=None, cursor=Depends(getCursorForPGDB)):
    redisKey = f"teamSummary_{season}_{team}_{teamType}_{innings}"
    if rd.exists(redisKey):
        return json.loads(rd.get(redisKey))
    sql = getSQLForTeamSummary(season,team,teamType, innings)
    rd.set(redisKey, json.dumps(jsonable_encoder(executeSQLQuery(sql, cursor, havingClause="DLS,N/R,Overs Reduced Matches not considered*"))))
    return json.loads(rd.get(redisKey))
