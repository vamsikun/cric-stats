# modify the fielders_involved string
# there is a plus sign at the start and end when there are two or more fielders involved
# TODO: optimize the following sql
# NOTE: here the indexing starts from 1

eval "$renderPSQL  -c \"
UPDATE runs
SET fielders_involved=SUBSTRING(fielders_involved FROM 2)
WHERE fielders_involved LIKE '+%';\""

# modify the match_id column to save space; as from mongo we get a string based match_id

# ---------------- players table -------------------- #

# adds a new column
eval "$renderPSQL  -c \"
ALTER TABLE players
ADD COLUMN match_id_new INTEGER;
\""

# populates the new COLUMN
eval "$renderPSQL  -c \"
UPDATE players
SET match_id_new = (SELECT match_id_new FROM matches WHERE players.match_id = matches.match_id);
\""

# drops the old column
eval "$renderPSQL  -c \"
ALTER TABLE players
DROP COLUMN match_id;
\""

# renames the new COLUMN
eval "$renderPSQL  -c \"
ALTER TABLE players
RENAME COLUMN match_id_new TO match_id;
\""

# ----------------- runs table ----------------------- #

# adds a new column
eval "$renderPSQL  -c \"
ALTER TABLE runs
ADD COLUMN match_id_new INTEGER;
\""

# populates the new column
eval "$renderPSQL  -c \"
UPDATE runs
SET match_id_new = (SELECT match_id_new FROM matches WHERE runs.match_id = matches.match_id);
\""

# drops the old column
eval "$renderPSQL  -c \"
ALTER TABLE runs
DROP COLUMN match_id;
\""

# renames the new column
eval "$renderPSQL  -c \"
ALTER TABLE runs
RENAME COLUMN match_id_new TO match_id;
\""

# ----------------- partnerships table ----------------------- #

# adds a new COLUMN
eval "$renderPSQL  -c \"
ALTER TABLE partnerships
ADD COLUMN match_id_new INTEGER;
\""

# populates the new column
eval "$renderPSQL  -c \"
UPDATE partnerships
SET match_id_new = (SELECT match_id_new FROM matches WHERE partnerships.match_id = matches.match_id);
\""

# drops the old column
eval "$renderPSQL  -c \"
ALTER TABLE partnerships
DROP COLUMN match_id;
\""

# renames the new column
eval "$renderPSQL  -c \"
ALTER TABLE partnerships
RENAME COLUMN match_id_new TO match_id;
\""

# ---------------- matches table --------------------- #
# drops the old column
eval "$renderPSQL  -c \"
ALTER TABLE matches
DROP COLUMN match_id;
\""

# rename new column
eval "$renderPSQL  -c \"
ALTER TABLE matches
RENAME COLUMN match_id_new TO match_id;
\""

# ---------------- don't forget to VACUUM the extra storage that get's created after we update tables --------------------- #
eval "$renderPSQL  -c \"VACUUM (FULL);\""
