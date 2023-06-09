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
    wicket,
    out_type,
    fielders_involved,
    bowler_wicket,
    boundaries
) FROM $1 DELIMITER ',' CSV HEADER;"

# modify the fielders_involved string
# there is a plus sign at the start and end when there are two or more fielders involved
# TODO: optimize the following sql
# NOTE: here the indexing starts from 1

psql -d ipl -c "
UPDATE runs
SET fielders_involved=SUBSTRING(fielders_involved FROM 2)
WHERE fielders_involved LIKE '+%';"
