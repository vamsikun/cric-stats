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
# for file in *.json; do
# 	mongoimport --db ipl --collection matches --file $file
# done

# back to the home directory
cd $CURR_DIR

# TODO: modify script to take arguments for the scripts folder
# execute mongo script
# mongosh <"./jsScripts/playersCollection.js"
# mongosh <"./jsScripts/matchesCollection.js"
# mongosh <"./jsScripts/runsCollection.js"
# mongosh <"./jsScripts/partnershipCollection.js"

# TODO: give args for database, collection and output file
# export the mongo collection to a csv file

# NOTE: following fields are NOT in list type, they are just placeholders for multiple fields

# fields for players collection;names should be same as the one in collection
# doing $fields would give us matchID,playerId,player,team
fieldsForPlayersCollection=("matchID","playerID","player","team")

# fields for matches collection;names should be same as the one in collection
fieldsForMatchesCollection=("matchID","matchNumber","season","matchStartDate","city","tossWon","tossDecision","isSuperOver")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team1","team2","teamWon","wonByWickets","wonByRuns","playerOfMatch")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team1Score","team1Wickets","team1Fours","team1Sixes","team1Extras")
fieldsForMatchesCollection=("$fieldsForMatchesCollection","team2Score","team2Wickets","team2Fours","team2Sixes","team2Extras")

# fields for runs collection;names should be same as the one in collection
fieldsForRunsCollection=("matchID","over","ballNo","innings","batter","nonStriker","bowler")
fieldsForRunsCollection=("$fieldsForRunsCollection","batterRuns","extraRuns","wide","noball","penalty","wicket","outType","fieldersInvolved","bowlerWicket","boundaries")

# fields for partnership collection; names should be same as the one in collection
fieldsForPartnershipCollection=("matchID","innings","firstBatter","secondBatter","partnership","totalBallsFaced","fours","sixes","wicket")
fieldsForPartnershipCollection=("$fieldsForPartnershipCollection","firstBatterRuns","firstBatterBallsFaced","firstBatterFours","firstBatterSixes")
fieldsForPartnershipCollection=("$fieldsForPartnershipCollection","secondBatterRuns","secondBatterBallsFaced","secondBatterFours","secondBatterSixes")

# players data
mongoexport -d ipl -c players --type=csv --fields "$fieldsForPlayersCollection" --out=players.csv
# matches data
mongoexport -d ipl -c eachMatch --type=csv --fields "$fieldsForMatchesCollection" --out=matches.csv

# runs data
mongoexport -d ipl -c runs --type=csv --fields "$fieldsForRunsCollection" --out=runs.csv

# partnership data
mongoexport -d ipl -c partnerships --type=csv --fields "$fieldsForPartnershipCollection" --out=partnership.csv

# you can execute the following command to add current user as a root user
# just for personal projects don't use this in production
# sudo -u postgres createuser -s $(whoami); createdb $(whoami)

# create database
psql -c "CREATE DATABASE ipl;"

# creates tables from the csv files
# NOTE: it's important to make use of both " and ' in the path when using shell variables due to the special characters
# WARN: the order is important here

./sqlScripts/createMatches.sh $CURR_DIR/matches.csv
./sqlScripts/createPlayers.sh $CURR_DIR/players.csv
./sqlScripts/createRuns.sh $CURR_DIR/runs.csv
./sqlScripts/createPartnerships.sh $CURR_DIR/partnership.csv
./sqlScripts/sqlHelpers.sh
./sqlScripts/createBatterStatsEachMatch.sh

# TODO: use index

# remove the temporary matches.csv file
rm $CURR_DIR/matches.csv
rm $CURR_DIR/players.csv
rm $CURR_DIR/runs.csv
rm $CURR_DIR/partnership.csv
