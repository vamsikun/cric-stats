# echo "use ('ipl'); db.matches.drop(); exit" | mongosh ipl
echo "use ('ipl'); db.players.drop();db.eachMatch.drop();db.runs.drop();db.partnerships.drop(); exit" | mongosh ipl

# TODO: we can simply do DROP DATABASE, but it's giving can't drop opened database error
psql -d "ipl" -c "DROP TABLE matches CASCADE; "
psql -d "ipl" -c "DROP TABLE teams;"
psql -d "ipl" -c "DROP TABLE players;"
psql -d "ipl" -c "DROP TABLE runs; "
psql -d "ipl" -c "DROP TABLE partnerships;"
psql -d "ipl" -c "DROP TABLE batter_stats_each_match;"
psql -d "ipl" -c "DROP TABLE bowler_stats_each_match;"
