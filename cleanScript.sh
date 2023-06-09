echo "use ('ipl'); db.matches.drop(); db.players.drop();db.eachMatch.drop();db.runs.drop();db.partnerships.drop(); exit" | mongosh ipl

# TODO: we can simply do DROP DATABASE, but it's giving can't drop opened database error
psql -d "ipl" -c "DROP TABLE matches CASCADE; DROP TABLE players; DROP TABLE runs; DROP TABLE partnerships;DROP TABLE player_stats_each_match;"
