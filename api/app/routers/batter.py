from typing import Annotated
from fastapi import APIRouter, Depends

# NOTE: ignore the import not resolved errors here; as it would be fine as we execute it from the app directory
from database import getCursorForPGDB
from typing import Type, Callable
from utils.endPointMappings import batterApiMappings
from utils.executeSQLQuery import executeSQLQuery

batterRouter = APIRouter(prefix="/batter", tags=["batter"])

def generateDynamicRoute(endPoint:str, schema: Type, columnPosition:int, generateSQLQuery: Callable, description: str):
    @batterRouter.get(
        f"/{endPoint}",
        response_model=schema,
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
        sqlQuery = generateSQLQuery(season, team, innings, opposition)
        return executeSQLQuery(sqlQuery, cursor, columnPosition)
    
batterMapKeys = list(batterApiMappings.keys())
for batterKey in batterMapKeys:
    endPoint = batterApiMappings[batterKey]['endPoint']
    schema = batterApiMappings[batterKey]['schema']
    columnPosition = list(batterApiMappings[batterKey]['schema'].__fields__.keys()).index(batterApiMappings[batterKey]['columnName'])
    generateSQLQuery = batterApiMappings[batterKey]['getSQLMethod']
    description = batterApiMappings[batterKey]['description']
    generateDynamicRoute(endPoint, dict[str,str|list[schema]], columnPosition, generateSQLQuery, description)