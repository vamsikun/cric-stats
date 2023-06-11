from fastapi import FastAPI
from routers.batter import batterRouter

app = FastAPI()

app.include_router(batterRouter)
