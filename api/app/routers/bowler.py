from typing import Annotated
from fastapi import APIRouter, Depends

# NOTE: ignore the import not resolved errors here; as it would be fine as we execute it from the app directory
from database import getCursorForPGDB
from utils.endPointMappings import bowlerApiMappings, havingClauseMappings
from utils.executeSQLQuery import executeSQLQuery

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
        response_model=dict[str,dict[str,str]|list[schema]],
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
        sqlQuery = generateSQLQuery(season, team, innings, opposition, havingClause)
        return executeSQLQuery(sqlQuery, cursor, columnPosition, havingClauseMappings[havingClause])
    
bowlerMapKeys = list(bowlerApiMappings.keys())
for bowlerKey in bowlerMapKeys:
    generateDynamicRoute(bowlerKey)