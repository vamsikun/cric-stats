psql -d ipl -c "
CREATE TABLE players(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id VARCHAR,
    player VARCHAR,
    team VARCHAR
);"

psql -d ipl -c "\COPY players(
    match_id,
    player_id,
    player,
    team
) FROM $1 DELIMITER ',' CSV HEADER;"
