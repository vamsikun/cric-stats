from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import getWherePredicate, getSelectStatement

# TODO: this doesn't work as a single player might have multiple high scores

def getSQLForBatterHighScore(season: Annotated[str | None, 'season'] = None,
                       team: Annotated[str | None, 'team'] = None,
                       innings: Annotated[int |
                                          None, 'innings'] = None,
                       opposition: Annotated[str | None, 'opposition'] = None):
    '''
    This function returns the sql query for players with high score
    '''
    # TODO: add not out for the hs column
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    groupByPredicate = " GROUP BY player ORDER BY hs DESC NULLS LAST LIMIT 10"
    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate

    return sql
