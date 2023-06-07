#!/bin/bash

# TODO: give checks for the input mandatory args 1)Data directory 2)CSV directory

# for this to work this file should be inside the folder where json files are present

# get the directory in which json files are present
DATA_DIR=$1

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

# TODO: modify script to take arguments for the scripts folder
# execute mongo script
mongosh <"./playersCollection.js"
mongosh <"./matchesCollection.js"
mongosh <"./runsCollection.js"
mongosh <"./outsCollection.js"
mongosh <"./partnershipCollection.js"

# TODO: give args for database, collection and output file
# export the mongo collection to a csv file

# NOTE: following fields are NOT in list type, they are just placeholders for multiple fields

# fields for players collection;names should be same as the one in collection
# doing $fields would give us matchID,playerId,player,team
fieldsForPlayersCollection=("matchID","playerID","player","team")

# fields for matches collection;names should be same as the one in collection
# have created this list in multiple lines just for conciseness
fieldsForMatchesCollection=("matchID","matchNumber","season","matchStartDate","city","tossWon","tossDecision","isSuperOver")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team1","team2","teamWon","wonByWickets","wonByRuns","playerOfMatch")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team1Score","team1Wickets","team1Fours","team1Sixes","team1Extras")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team2Score","team2Wickets","team2Fours","team2Sixes","team2Extras")

# fields for runs collection;names should be same as the one in collection
fieldsForRunsCollection=("matchID","season","battingTeam","bowlingTeam","over","ballNo","innings","batter","nonStriker","bowler")
fieldsForRunsCollection=("$fieldsForRunsCollection","batterRuns","extraRuns","wide","noball","wicket","boundaries")

# fields for outs collection;names should be same as the one in collection
fieldsForOutsCollection=("matchID","season","battingTeam","bowlingTeam","over","ballNo","innings","bowler","playerOut","outType","fieldersInvolved")

# fields for partnership collection; names should be same as the one in collection
fieldsForPartnershipCollection=("matchID","season","battingTeam","bowlingTeam","innings","firstBatter","secondBatter","partnership","totalBallsFaced","fours","sixes","wicket")
fieldsForPartnershipCollection=("$fieldsForPartnershipCollection","firstBatterRuns","firstBatterBallsFaced","firstBatterFours","firstBatterSixes")
fieldsForPartnershipCollection=("$fieldsForPartnershipCollection","secondBatterRuns","secondBatterBallsFaced","secondBatterFours","secondBatterSixes")

# players data
mongoexport -d ipl -c players --type=csv --fields "$fieldsForPlayersCollection" --out=players.csv

# matches data
mongoexport -d ipl -c eachMatch --type=csv --fields "$fieldsForMatchesCollection" --out=matches.csv

# runs data
mongoexport -d ipl -c runs --type=csv --fields "$fieldsForRunsCollection" --out=runs.csv

# outs data
mongoexport -d ipl -c outs --type=csv --fields "$fieldsForOutsCollection" --out=outs.csv

# partnership data
mongoexport -d ipl -c partnerships --type=csv --fields "$fieldsForPartnershipCollection" --out=partnership.csv

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
CREATE TABLE matches(
    match_id VARCHAR PRIMARY KEY,
    match_number VARCHAR,
    season VARCHAR,
    match_start_date VARCHAR,
    city VARCHAR,
    toss_won VARCHAR,
    toss_decision VARCHAR,
    is_super_over SMALLINT,
    team1 VARCHAR,
    team2 VARCHAR,
    team_won VARCHAR,
    won_by_wickets SMALLINT,
    won_by_runs SMALLINT,
    player_of_match VARCHAR,
    team1_score SMALLINT,
    team1_wickets SMALLINT,
    team1_fours SMALLINT,
    team1_sixes SMALLINT,
    team1_extras SMALLINT,
    team2_score SMALLINT,
    team2_wickets SMALLINT,
    team2_fours SMALLINT,
    team2_sixes SMALLINT,
    team2_extras SMALLINT
);
"
psql -d "ipl" -c "
CREATE TABLE players(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id VARCHAR,
    player VARCHAR,
    team VARCHAR
);
"

psql -d "ipl" -c "
CREATE TABLE runs(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    season VARCHAR,
    batting_team VARCHAR,
    bowling_team VARCHAR,
    over SMALLINT,
    ball_no SMALLINT,
    innings SMALLINT,
    batter VARCHAR,
    non_striker VARCHAR,
    bowler VARCHAR,
    batter_runs SMALLINT,
    extra_runs SMALLINT,
    wide SMALLINT,
    noball SMALLINT,
    wicket VARCHAR,
    boundaries SMALLINT
);
"

psql -d "ipl" -c "
CREATE TABLE outs(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    season VARCHAR,
    batting_team VARCHAR,
    bowling_team VARCHAR,
    over SMALLINT,
    ball_no SMALLINT,
    innings SMALLINT,
    bowler VARCHAR,
    player_out VARCHAR,
    out_type VARCHAR,
    fielders_involved VARCHAR
);
"

psql -d "ipl" -c "
CREATE TABLE partnerships(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    season VARCHAR,
    batting_team VARCHAR,
    bowling_team VARCHAR,
    innings SMALLINT,
    first_batter VARCHAR,
    second_batter VARCHAR,
    partnership SMALLINT,
    total_balls_faced SMALLINT,
    fours SMALLINT,
    sixes SMALLINT,
    wicket SMALLINT,
    first_batter_runs SMALLINT,
    first_batter_balls_faced SMALLINT,
    first_batter_fours SMALLINT,
    first_batter_sixes SMALLINT,
    second_batter_runs SMALLINT,
    second_batter_balls_faced SMALLINT,
    second_batter_fours SMALLINT,
    second_batter_sixes SMALLINT
);
"

# TODO: give args for database, table name and import csv file
# import csv file to a table

psql -d "ipl" -c "\COPY matches(
    match_id,
    match_number,
    season,
    match_start_date,
    city,
    toss_won,
    toss_decision,
    is_super_over,
    team1,
    team2,
    team_won,
    won_by_wickets,
    won_by_runs,
    player_of_match,
    team1_score,
    team1_wickets,
    team1_fours,
    team1_sixes,
    team1_extras,
    team2_score,
    team2_wickets,
    team2_fours,
    team2_sixes,
    team2_extras
) FROM $CURR_DIR/matches.csv DELIMITER ',' CSV HEADER;"

psql -d "ipl" -c "\COPY players(
    match_id,
    player_id,
    player,
    team
) FROM $CURR_DIR/players.csv DELIMITER ',' CSV HEADER;"

psql -d "ipl" -c "\COPY runs(
    match_id,
    season,
    batting_team,
    bowling_team,
    over,
    ball_no,
    innings,
    batter,
    non_striker,
    bowler,
    batter_runs,
    extra_runs,
    wide,
    noball,
    wicket,
    boundaries
) FROM $CURR_DIR/runs.csv DELIMITER ',' CSV HEADER;"

psql -d "ipl" -c "\COPY outs(
    match_id,
    season,
    batting_team,
    bowling_team,
    over,
    ball_no,
    innings,
    bowler,
    player_out,
    out_type,
    fielders_involved
) FROM $CURR_DIR/outs.csv DELIMITER ',' CSV HEADER;"

psql -d "ipl" -c "\COPY partnerships(
    match_id,
    season,
    batting_team,
    bowling_team,
    innings,
    first_batter,
    second_batter,
    partnership,
    total_balls_faced,
    fours,
    sixes,
    wicket,
    first_batter_runs,
    first_batter_balls_faced,
    first_batter_fours,
    first_batter_sixes,
    second_batter_runs,
    second_batter_balls_faced,
    second_batter_fours,
    second_batter_sixes
) FROM $CURR_DIR/partnership.csv DELIMITER ',' CSV HEADER;"

# modify the matchID string

# psql -d "ipl" -c "update players
# set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
#
# psql -d "ipl" -c "update matches
# set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
#
# psql -d "ipl" -c "update runs
# set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
#
# psql -d "ipl" -c "update outs
# set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
#
# psql -d "ipl" -c "update partnerships
# set match_id = split_part(split_part(match_id, '(', 2), ')', 1);"
