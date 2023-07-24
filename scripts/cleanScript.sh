#!/bin/bash
echo "use ('ipl'); db.matches.drop(); exit" | mongosh ipl
echo "use ('ipl'); db.players.drop();db.eachMatch.drop();db.runs.drop();db.partnerships.drop(); exit" | mongosh ipl

# TODO: we can simply do DROP DATABASE, but it's giving can't drop opened database error
eval "$renderPSQL -c \"DROP TABLE matches CASCADE; \""
eval "$renderPSQL -c \"DROP TABLE teams;\""
eval "$renderPSQL -c \"DROP TABLE players;\""
eval "$renderPSQL -c \"DROP TABLE runs; \""
eval "$renderPSQL -c \"DROP TABLE partnerships;\""
eval "$renderPSQL -c \"DROP TABLE batter_stats_each_match;\""
eval "$renderPSQL -c \"DROP TABLE bowler_stats_each_match;\""
