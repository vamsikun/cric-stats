from fastapi import FastAPI
from routers.batter import batterRouter
from routers.bowler import bowlerRouter

app = FastAPI()

app.include_router(batterRouter)
app.include_router(bowlerRouter)
