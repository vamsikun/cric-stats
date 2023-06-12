from typing import Annotated
from getSQLScripts.batter.batterSQLHelper import getWherePredicate, getSelectStatement, avgCalculation


def getSQLForBatterHighestStrikeRate(season: Annotated[str | None, 'season'] = None,
                               team: Annotated[str | None, 'team'] = None,
                               innings: Annotated[int |
                                                  None, 'innings'] = None,
                               opposition: Annotated[str | None, 'opposition'] = None):
    '''
    This function returns the sql query for players
    with highest strike rate having more than or equal to 25 average
    '''
    # TODO: add not out for the hs column
    # NOTE: don't worry much about the case of the sql keywords as we are using psycopg2 which is case insensitive

    groupByPredicate = f" GROUP BY player HAVING {avgCalculation}>=25 ORDER BY sr DESC LIMIT 10"

    sql = getSelectStatement()
    sql += getWherePredicate(season, team, innings, opposition)
    sql += groupByPredicate

    return sql
