psql -d ipl -c "CREATE TABLE matches(
    match_id_new SERIAL PRIMARY KEY,
    match_id VARCHAR UNIQUE,
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
);"

psql -d ipl -c "\COPY matches(
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
) FROM $1 DELIMITER ',' CSV HEADER;"

psql -d ipl -c "
create table teams as
select distinct(team1) as team from matches
union 
select distinct(team2) as team from matches;
  "

psql -d ipl -c "ALTER TABLE teams ADD COLUMN team_id SERIAL PRIMARY KEY;"

# modify the teams column in matches
psql -d ipl -c "
UPDATE matches
SET toss_won= (SELECT team_id FROM teams WHERE matches.toss_won = teams.team),
team1= (SELECT team_id FROM teams WHERE matches.team1 = teams.team),
team2= (SELECT team_id FROM teams WHERE matches.team2 = teams.team),
team_won = (SELECT team_id FROM teams WHERE matches.team_won = teams.team);"
