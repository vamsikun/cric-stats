from pydantic import BaseModel
from typing import Annotated


class MostWickets(BaseModel):
    # NOTE: here I am not using camelcase as psql is case sensitive on columns, so it was creating some issues when pydantic checks the column names
    pos: Annotated[int, "position"]
    player: Annotated[str, "player"]
    matches: Annotated[int, "matches"]
    innings: Annotated[int, "innings"]
    overs: Annotated[float, "overs"]
    dots_percentage: Annotated[float, "dots_percentage"]
    wickets: Annotated[int | None, "wickets"] = None
    runs: Annotated[int | None, "runs_conceded"] = None
    sr: Annotated[float | None, "sr"] = None
    avg: Annotated[float | None, "avg"] = None
    econ: Annotated[float | None, "econ"] = None
    # bbi: Annotated[str,'best bowling in innings']


class BestAverage(MostWickets):
    pass


class BestEcon(MostWickets):
    pass


class BestStrikeRate(MostWickets):
    pass


class BestDotsPercentage(MostWickets):
    pass
