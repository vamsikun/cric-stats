#!/bin/bash
redis-server --daemonize yes
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
