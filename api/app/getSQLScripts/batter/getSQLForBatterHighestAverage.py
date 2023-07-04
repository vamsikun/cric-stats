from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import (
    getWherePredicate,
    getSelectStatement,
    limit,
    havingFilter,
)


def getSQLForBatterHighestAverage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    """
    This function returns the sql query for players
    with highest average having more than 100 runs
    """
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    groupByPredicate = (
        f" GROUP BY player {havingFilter} ORDER BY avg DESC LIMIT {limit}"
    )

    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate

    return sql
