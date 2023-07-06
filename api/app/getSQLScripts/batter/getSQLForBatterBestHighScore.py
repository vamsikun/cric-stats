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
    havingClause: Annotated[str, "havingClause"]=""
):
    """
    This function returns the sql query for the players with most runs
    """
    
    wherePredicate = getWherePredicate(season, team, innings, opposition)
    groupByPredicate = "match_id,player"
    hsStatementConfig = SelectStatementConfig(player=True, hs=True, sr=True, fours=True, sixes=True)    
    extraCols = "STRING_AGG(DISTINCT t1.team_shortcut, ',') as team,STRING_AGG(DISTINCT t2.team_shortcut,',') as opposition,"
    joinPredicate = """LEFT JOIN teams as t1 on batter_stats_each_match.team=t1.team_id LEFT JOIN teams as t2 on batter_stats_each_match.opposition=t2.team_id """
    sqlStatement = hsStatementConfig.getSelectStatement(extraCols=extraCols,
                                                        joinPredicate=joinPredicate,
                                                        wherePredicate=wherePredicate,
                                                        groupByPredicate=groupByPredicate,
                                                        havingPredicate=havingClause,
                                                        orderByPredicate="hs DESC")
    return sqlStatement