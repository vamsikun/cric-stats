CREATE TABLE players(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id VARCHAR,
    player VARCHAR,
    team VARCHAR
);

COPY players(
    match_id,
    player_id,
    player,
    team
) FROM :PLAYERS_FILE DELIMITER ',' CSV HEADER;


