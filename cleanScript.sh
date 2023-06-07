echo "use ('ipl'); db.matches.drop(); db.players.drop();db.eachMatch.drop();db.runs.drop();db.partnerships.drop(); exit" | mongosh ipl

psql -d "ipl" -c "DROP TABLE matches CASCADE; DROP TABLE players; DROP TABLE runs; DROP TABLE partnerships;"
