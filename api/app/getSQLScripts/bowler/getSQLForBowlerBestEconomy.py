from typing import Annotated
from getSQLScripts.bowler.bowlerSQLHelper import getSelectStatement, getWherePredicate

def getSQLForBowlerBestEconomy(season: Annotated[str | None, 'season'] = None,
                       team: Annotated[str | None, 'team'] = None,
                       innings: Annotated[int |
                                          None, 'innings'] = None,
                       opposition: Annotated[str | None, 'opposition'] = None):
    groupByPredicate = " GROUP BY player ORDER BY econ ASC NULLS LAST LIMIT 10"
    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate
    return sql