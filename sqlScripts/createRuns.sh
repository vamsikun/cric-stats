psql -d ipl -c "
CREATE TABLE runs(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    season VARCHAR,
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
    penalty SMALLINT,
    wicket VARCHAR,
    out_type VARCHAR,
    fielders_involved VARCHAR,
    bowler_wicket SMALLINT,
    boundaries SMALLINT
);"

psql -d ipl -c "\COPY runs(
    match_id,
    season,
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
    penalty,
    wicket,
    out_type,
    fielders_involved,
    bowler_wicket,
    boundaries
) FROM $1 DELIMITER ',' CSV HEADER;"
