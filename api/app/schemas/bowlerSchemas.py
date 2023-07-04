from pydantic import BaseModel
from typing import Annotated


class MostWickets(BaseModel):
    pos: Annotated[int, "position"]
    player: Annotated[str, "player"]
    matches: Annotated[int, "matches"]
    innings: Annotated[int, "innings"]
    overs: Annotated[float, "overs"]
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
