eval "$renderPSQL -c \"CREATE TABLE partnerships(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
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
);\""

eval "$renderPSQL -c \"\COPY partnerships(
    match_id,
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
) FROM $1 DELIMITER ',' CSV HEADER;\""
