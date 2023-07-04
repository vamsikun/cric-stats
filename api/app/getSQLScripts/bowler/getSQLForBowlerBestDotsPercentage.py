from typing import Annotated
from getSQLScripts.bowler.bowlerSQLHelper import (
    getSelectStatement,
    getWherePredicate,
    limit,
    havingFilter,
)


def getSQLForBowlerBestDotsPercentage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    groupByPredicate = f" GROUP BY player {havingFilter} ORDER BY dots_percentage DESC NULLS LAST LIMIT {limit}"
    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate
    return sql
