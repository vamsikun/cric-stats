from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import (
    getWherePredicate,
    getSelectStatement,
    limit,
)


def getSQLForBatterMostFours(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    """
    This function returns the sql query for players
    with highest strike rate having more than 100 runs
    """
    # TODO: add not out for the hs column
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    groupByPredicate = f" GROUP BY player ORDER BY fours DESC NULLS LAST LIMIT {limit}"

    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate

    return sql
