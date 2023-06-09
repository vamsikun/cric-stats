# create a multi-column index on player_stats
# NOTE: order matters when making use of this index
# TODO: index is not being used; check if it's being used in the future or not
# TODO: try to include player column too, but it will increase the size of the index
psql -d "ipl" -c "CREATE INDEX player_stats_index ON player_stats_each_match (season, innings, team, opposition);"
psql -d "ipl" -c "CREATE INDEX player_stats_player_index ON player_stats_each_match (player);"
