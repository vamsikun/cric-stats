from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import (
    defaultSelectConfig,
    getWherePredicate,
    selectTeamDetails
)


def getSQLForBatterMostRuns(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    wherePredicate = getWherePredicate(season, team, innings, opposition)
    sql = defaultSelectConfig.getSelectStatement(extraCols=selectTeamDetails['selectStatement'],joinPredicate=selectTeamDetails['joinStatement'],wherePredicate=wherePredicate,
                                                 groupByPredicate="player",
                                                 orderByPredicate="runs DESC",
                                                 )

    return sql
