from typing import Annotated, List
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from pydantic.types import Json
import psycopg2
import psycopg2.extensions
import psycopg2.extras
import json


def getDbConnection():
    conn = psycopg2.connect(
        database="ipl",
        user="vamsi",
        password="vamsi",
        host="localhost",
        port="5432"
    )
    try:
        yield conn
    finally:
        conn.close()


app = FastAPI()


class MostRuns(BaseModel):
    season: str
    innings: int
    player: str
    runs: int


def getMostRunsSQL(season: str | None,
                   innings: int | None,
                   team: str | None,
                   opposition: str | None) -> str:

    sql = "SELECT player, sum(runs) as runs, ROUND(sum(runs)/sum(balls_faced)) FROM player_stats "
    wherePredicate = ""
    groupByPredicate = "GROUP BY player"
    if any([season, innings, team, opposition]):
        wherePredicate += "WHERE "
    if team:
        wherePredicate += f"team='{team}' AND "
    if opposition:
        wherePredicate += f"opposition='{opposition}' AND "
    if season:
        wherePredicate += f"season='{season}' AND "
    if innings:
        wherePredicate += f"innings={innings} AND "

    if wherePredicate[-4:] == 'AND ':
        wherePredicate = wherePredicate[:-4]

    sql += wherePredicate
    sql += groupByPredicate
    sql += " LIMIT 10;"

    return sql


@app.get("/mostRuns", response_model=List[MostRuns])
async def root(season: Annotated[str | None, 'Season'] = None,
               innings: Annotated[int | None, 'Innings'] = None,
               team: Annotated[str | None, 'Team'] = None,
               opposition: Annotated[str | None, 'Opposition'] = None,
               conn=Depends(getDbConnection)):
    cur = conn.cursor()
    cur.execute(getMostRunsSQL(season, innings, team, opposition))
    rows = cur.fetchall()
    cur.close()

    column_names = [desc[0] for desc in cur.description]
    return [dict(zip(column_names, row)) for row in rows]
