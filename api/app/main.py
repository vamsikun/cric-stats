from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.batter import batterRouter
from routers.bowler import bowlerRouter

app = FastAPI()

origins = [
    "http://192.168.9.6:3000",
    "http://localhost:3000",
    "http://localhost"
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(batterRouter)
app.include_router(bowlerRouter)
