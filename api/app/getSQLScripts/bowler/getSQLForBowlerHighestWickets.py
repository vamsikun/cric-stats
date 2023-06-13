from typing import Annotated
from getSQLScripts.bowler.bowlerSQLHelper import getSelectStatement

def getSQLForBowlerHighestWickets(season: Annotated[str | None, 'season'] = None,
                       team: Annotated[str | None, 'team'] = None,
                       innings: Annotated[int |
                                          None, 'innings'] = None,
                       opposition: Annotated[str | None, 'opposition'] = None):
    return getSelectStatement()
