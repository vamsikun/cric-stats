from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import (
    SelectStatementConfig,
    getWherePredicate
)


def getSQLForBatterBestHighScore(
    season: Annotated[str | None, "season"] = None,
    team: Annotated[str | None, "team"] = None,
    innings: Annotated[int | None, "innings"] = None,
    opposition: Annotated[str | None, "opposition"] = None,
):
    """
    This function returns the sql query for the players with most runs
    """
    # TODO: there is no need of group by here so try to remove it
    
    wherePredicate = getWherePredicate(season, team, innings, opposition)
    groupByPredicate = "match_id,player,t1.team,t2.team"
    hsStatementConfig = SelectStatementConfig(player=True, hs=True, sr=True, fours=True, sixes=True)    
    extraCols = "t1.team as team,t2.team as opposition,"
    joinPredicate = """LEFT JOIN teams as t1 on batter_stats_each_match.team=t1.team_id LEFT JOIN teams as t2 on batter_stats_each_match.opposition=t2.team_id """
    sqlStatement = hsStatementConfig.getSelectStatement(extraCols=extraCols,
                                                        joinPredicate=joinPredicate,
                                                        wherePredicate=wherePredicate,
                                                        groupByPredicate=groupByPredicate,
                                                        orderByPredicate="hs DESC")
    return sqlStatement