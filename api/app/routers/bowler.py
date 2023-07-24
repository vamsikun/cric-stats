from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
import json

# NOTE: ignore the import not resolved errors here; as it would be fine as we execute it from the app directory
from database import getCursorForPGDB, rd
from utils.endPointMappings import bowlerApiMappings, havingClauseMappings
from utils.getSQLQuery import executeSQLQuery

bowlerRouter = APIRouter(prefix="/bowler", tags=["bowler"])

def generateDynamicRoute(bowlerKey:str):
    endPoint = bowlerApiMappings[bowlerKey]['endPoint']
    schema = bowlerApiMappings[bowlerKey]['schema']
    columnPosition = list(bowlerApiMappings[bowlerKey]['schema'].__fields__.keys()).index(bowlerApiMappings[bowlerKey]['columnName'])
    generateSQLQuery = bowlerApiMappings[bowlerKey]['getSQLMethod']
    havingClause = bowlerApiMappings[bowlerKey]['havingClause']
    description = bowlerApiMappings[bowlerKey]['description']
    @bowlerRouter.get(
        f"/{endPoint}",
        response_model=dict[str,dict[str,str|int]|list[schema]],
        description=description,
        name=endPoint
    )
    async def dynamicRoute(
        season: Annotated[str | None, "season"] = None,
        team: Annotated[str | None, "team"] = None,
        innings: Annotated[int | None, "innings"] = None,
        opposition: Annotated[str | None, "opposition"] = None,
        cursor=Depends(getCursorForPGDB),
    ):
        # TODO: understand how the json.dumps, json.loads and jsonable_encoder works
        redisKey = f"bowler_{bowlerKey}_{season}_{team}_{innings}_{opposition}"
        if rd.exists(redisKey):
            return json.loads(rd.get(redisKey))
        sqlQuery = generateSQLQuery(season, team, innings, opposition, havingClause)
        rd.set(redisKey, json.dumps(jsonable_encoder((executeSQLQuery(sqlQuery, cursor, columnPosition, havingClauseMappings[havingClause], includePosition=True)))))
        return json.loads(rd.get(redisKey))
    
bowlerMapKeys = list(bowlerApiMappings.keys())
for bowlerKey in bowlerMapKeys:
    generateDynamicRoute(bowlerKey)
