echo "use ('ipl'); db.matches.drop(); db.ballByball.drop(); exit" | mongosh ipl

psql -d "ipl" -c "DROP TABLE ball_by_ball; DROP TABLE outs;"
