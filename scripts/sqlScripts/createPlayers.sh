eval "$renderPSQL  -c \"
CREATE TABLE players(
    match_id VARCHAR REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id VARCHAR,
    player VARCHAR,
    team VARCHAR,
    innings SMALLINT
);\""

eval "$renderPSQL  -c \"\COPY players(
    match_id,
    player_id,
    player,
    team,
    innings
) FROM $1 DELIMITER ',' CSV HEADER;\""

eval "$renderPSQL  -c \"
UPDATE players
SET team=(SELECT team_id FROM teams WHERE team=players.team);
\""

eval "$renderPSQL  -c \"
ALTER TABLE players
ALTER COLUMN team TYPE SMALLINT USING team::SMALLINT;
\""
