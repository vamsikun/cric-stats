from pydantic import BaseModel
from typing import Annotated


class MostRuns(BaseModel):
    pos: Annotated[int, "position"]
    player: Annotated[str, "player"]
    matches: Annotated[int, "matches"]
    innings: Annotated[int, "innings"]
    runs: Annotated[int, "runs"]
    hs: Annotated[int | None, "highest score"] = None
    sr: Annotated[float, "strike rate"]
    avg: Annotated[float | None, "average"] = None
    fours: Annotated[int | None, "fours"] = None
    sixes: Annotated[int | None, "sixes"] = None


class MostSixes(MostRuns):
    pass


class MostFours(MostRuns):
    pass


class BestHighScore(MostRuns):
    pass


class BestStrikeRate(MostRuns):
    pass


class BestAverage(MostRuns):
    pass
