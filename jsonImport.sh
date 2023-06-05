#!/bin/bash

# TODO: give checks for the input mandatory args 1)Data directory 2)CSV directory

# for this to work this file should be inside the folder where json files are present

# get the directory in which json files are present
DATA_DIR=$1

# get the path for the js script for manipulating data
MONGO_SCRIPT=$2

# store the current directory
CURR_DIR=$(pwd)

# change directory to data directory
cd $DATA_DIR

# imports each json file to mongo database
for file in *.json; do
	mongoimport --db ipl --collection matches --file $file
done

# back to the home directory
cd $CURR_DIR

# execute mongo script
mongosh <$MONGO_SCRIPT

# TODO: give args for database, collection and output file
# export the mongo collection to a csv file
# ball by ball data
mongoexport -d ipl -c ballByball --type=csv --fields season,matchID,innings,over,ballNo,battingTeam,bowlingTeam,batter,nonStriker,bowler,batterRuns,extraRuns,wide,noball,boundaries --out=ballByball.csv
# outs data
mongoexport -d ipl -c outs --type=csv --fields season,matchID,innings,over,ballNo,battingTeam,bowlingTeam,bowler,playerOut,outType,fielderInvolved,bowlerWicket --out=outs.csv

# you can execute the following command to add current user as a root user
# just for personal projects don't use this in production
# sudo -u postgres createuser -s $(whoami); createdb $(whoami)

# TODO: add a check if the database already exists; give argument to the database name
# create database
psql -c "CREATE DATABASE ipl"
#
# TODO: give argument for database and new table
# NOTE: converting some types to SMALLINT is taking less space than using a boolean
# create the table for importing the csv file

psql -d "ipl" -c "

CREATE TABLE ball_by_ball(
    season VARCHAR,
    match_id VARCHAR,
    innings SMALLINT,
    over SMALLINT,
    ball_no SMALLINT,
    bowling_team VARCHAR,
    batting_team VARCHAR,
    batter VARCHAR,
    non_striker VARCHAR,
    bowler VARCHAR,
    batter_runs SMALLINT,
    extra_runs SMALLINT,
    wide SMALLINT,
    noball SMALLINT,
    boundaries SMALLINT
);

"

psql -d "ipl" -c "
CREATE TABLE outs(
    season VARCHAR,
    match_id VARCHAR,
    innings SMALLINT,
    over SMALLINT,
    ball_no SMALLINT,
    bowling_team VARCHAR,
    batting_team VARCHAR,
    bowler VARCHAR,
    player_out VARCHAR,
    out_type VARCHAR,
    fielder_involved VARCHAR,
    bowler_wicket SMALLINT
);

"

# TODO: give args for database, table name and import csv file
# import csv file to a table
psql -d "ipl" -c "\COPY ball_by_ball(
    season,
    match_id,
    innings,
    over,
    ball_no,
    batting_team,
    bowling_team,
    batter,
    non_striker,
    bowler,
    batter_runs,
    extra_runs,
    wide,
    noball,
    boundaries
)
FROM $CURR_DIR/ballByball.csv DELIMITER ',' CSV HEADER;"

psql -d "ipl" -c "\COPY outs(
    season,
    match_id,
    innings,
    over,
    ball_no,
    batting_team,
    bowling_team,
    bowler,
    player_out,
    out_type,
    fielder_involved,
    bowler_wicket
)
FROM $CURR_DIR/outs.csv DELIMITER ',' CSV HEADER;"

# modify the matchID string
psql -d "ipl" -c "update ball_by_ball
set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"

psql -d "ipl" -c "update outs
set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
