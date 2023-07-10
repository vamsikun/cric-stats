from typing import Annotated
from getSQLScripts.bowler.bowlerSQLHelper import (
    defaultSelectConfig,
    selectTeamDetails,
)
from utils.getSQLQuery import getWherePredicate

def getSQLForBowlerBestStrikeRate(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    havingClause: Annotated[str, "havingClause"]=""
):
    wherePredicate = getWherePredicate(season=season, team=team, innings=innings, opposition=opposition)
    sql = defaultSelectConfig.getSelectStatement(
        extraCols=selectTeamDetails['selectStatement'],
        joinPredicate=selectTeamDetails['joinStatement'],
        wherePredicate=wherePredicate,
        groupByPredicate="player",
        havingPredicate=havingClause,
        orderByPredicate="sr ASC",
    )
    return sql
