from typing import Annotated
from getSQLScripts.bowler.bowlerSQLHelper import (
    getWherePredicate,
    defaultSelectConfig,
    selectTeamDetails
)


def getSQLForBowlerMostWickets(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    wherePredicate = getWherePredicate(season, team, innings, opposition)
    sql = defaultSelectConfig.getSelectStatement(extraCols=selectTeamDetails['selectStatement'],
                                                 joinPredicate=selectTeamDetails['joinStatement'],
                                                 wherePredicate=wherePredicate,
                                                 groupByPredicate="player",
                                                 orderByPredicate="wickets DESC")
    return sql
