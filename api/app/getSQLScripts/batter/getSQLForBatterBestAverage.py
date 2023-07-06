from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import (
    getWherePredicate,
    defaultSelectConfig,
    selectTeamDetails
)

def getSQLForBatterBestAverage(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
    havingClause: Annotated[str, "havingClause"]=""
):
    """
    returns the sql query for players
    with highest average having more than 100 runs
    """
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    wherePredicate = getWherePredicate(season, team, innings, opposition)
    sql = defaultSelectConfig.getSelectStatement(extraCols=selectTeamDetails['selectStatement'],
                                                 joinPredicate=selectTeamDetails['joinStatement'],
                                                 wherePredicate=wherePredicate,
                                                 groupByPredicate="player",
                                                 havingPredicate=havingClause,
                                                 orderByPredicate="avg DESC"
                                                 )

    return sql