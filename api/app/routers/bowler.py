from fastapi import APIRouter, Depends
from database import getCursorForPGDB
from getSQLScripts.bowler.bowlerSQLHelper import getSelectStatement

bowlerRouter = APIRouter(prefix="/bowler", tags=["bowler"])


@bowlerRouter.get("/mostWickets")
async def getMostWickets(cursor=Depends(getCursorForPGDB)):
    cursor.execute(getSelectStatement())
    return cursor.fetchall()
