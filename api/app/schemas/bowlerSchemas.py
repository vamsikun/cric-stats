from pydantic import BaseModel
from typing import Annotated

class MostWickets(BaseModel):
    player: Annotated[str,'player']
    overs: Annotated[int,'overs']
    wickets: Annotated[int,'wickets']
    sr: Annotated[float,'sr']
    avg: Annotated[float,'avg']
    econ: Annotated[float,'econ']
    bbi: Annotated[str,'best bowling in innings']
