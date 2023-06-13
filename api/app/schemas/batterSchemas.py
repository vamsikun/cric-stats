from pydantic import BaseModel
from typing import Annotated


class MostRuns(BaseModel):
    player: Annotated[str, 'player']
    matches: Annotated[int, 'matches']
    innings: Annotated[int,'innings']
    runs: Annotated[int, 'runs']
    sr: Annotated[float, 'strike rate']
    avg: Annotated[float | None, 'average'] = None
    hs: Annotated[int | None, 'highest score'] = None
    sixes: Annotated[int | None, 'sixes'] = None
    fours: Annotated[int | None, 'fours'] = None


class MostSixes(MostRuns):
    pass


class MostFours(MostRuns):
    pass


# class HighScore(MostRuns):
#     pass


class HighestStrikeRate(MostRuns):
    pass


class HighestAverage(MostRuns):
    pass
