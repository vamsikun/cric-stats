from fastapi import APIRouter, Depends
from database import getCursorForPGDB

router = APIRouter(prefix="/bowler", tags=["bowler"])


@router.get("/mostWickets")
async def getMostWickets(cursor=Depends(getCursorForPGDB)):
    cursor.execute("SELECT * FROM most_wickets")
    return cursor.fetchall()
