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
    dls SMALLINT,
    overs_reduced SMALLINT,
    team1 VARCHAR,
    team2 VARCHAR,
    team_won VARCHAR,
    won_by_wickets SMALLINT,
    won_by_runs SMALLINT,
    player_of_match VARCHAR,
    team1_score SMALLINT,
    m_team1_score VARCHAR,
    team1_wickets SMALLINT,
    team1_fours SMALLINT,
    team1_sixes SMALLINT,
    team1_extras SMALLINT,
    team1_legal_deliveries_faced SMALLINT,
    team2_score SMALLINT,
    m_team2_score VARCHAR,
    team2_wickets SMALLINT,
    team2_fours SMALLINT,
    team2_sixes SMALLINT,
    team2_extras SMALLINT,
    team2_legal_deliveries_faced SMALLINT
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
dls,
overs_reduced,
team1,
team2,
team_won,
won_by_wickets,
won_by_runs,
player_of_match,
team1_score,
m_team1_score,
team1_wickets,
team1_fours,
team1_sixes,
team1_extras,
team1_legal_deliveries_faced,
team2_score,
m_team2_score,
team2_wickets,
team2_fours,
team2_sixes,
team2_extras,
team2_legal_deliveries_faced
) FROM $1 DELIMITER ',' CSV HEADER;"

psql -d ipl -c "
create table teams as
select distinct(team1) as team from matches
union 
select distinct(team2) as team from matches;
  "

psql -d ipl -c "ALTER TABLE teams
ADD COLUMN team_id SERIAL PRIMARY KEY,
ADD COLUMN team_shortcut VARCHAR;"

psql -d ipl -c "
UPDATE teams
SET team_shortcut = CASE WHEN team='Pune Warriors India' THEN 'PWI'
                        WHEN team='Royal Challengers Bangalore' THEN 'RCB'
                        WHEN team='Delhi Capitals' THEN 'DC'
                        WHEN team='Chennai Super Kings' THEN 'CSK'
                        WHEN team='Kolkata Knight Riders' THEN 'KKR'
                        WHEN team='Rajasthan Royals' THEN 'RR'
                        WHEN team='Sunrisers Hyderabad' THEN 'SRH'
                        WHEN team='Rising Pune Supergiants' THEN 'RPS'
                        WHEN team='Lucknow Super Giants' THEN 'LSG'
                        WHEN team='Kings XI Punjab' THEN 'KXIP'
                        WHEN team='Mumbai Indians' THEN 'MI'
                        WHEN team='Gujarat Titans' THEN 'GT'
                        WHEN team='Gujarat Lions' THEN 'GL'
                        WHEN team='Kochi Tuskers Kerala' THEN 'KTK'
                        WHEN team='Deccan Chargers' THEN 'DCH'
                        END;
"

# modify the teams column in matches
psql -d ipl -c "
UPDATE matches
SET toss_won= (SELECT team_id FROM teams WHERE matches.toss_won = teams.team),
team1= (SELECT team_id FROM teams WHERE matches.team1 = teams.team),
team2= (SELECT team_id FROM teams WHERE matches.team2 = teams.team),
team_won = (SELECT team_id FROM teams WHERE matches.team_won = teams.team);"

# modify the type of teams
psql -d ipl -c "
ALTER TABLE matches
ALTER COLUMN toss_won TYPE SMALLINT USING toss_won::SMALLINT,
ALTER COLUMN team_won TYPE SMALLINT USING team_won::SMALLINT,
ALTER COLUMN team1 TYPE SMALLINT USING team1::SMALLINT,
ALTER COLUMN team2 TYPE SMALLINT USING team2::SMALLINT;"
