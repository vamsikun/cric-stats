psql -d ipl -c "
CREATE TABLE batter_stats_each_match as
select m.season as season,
    m.match_id::INTEGER as match_id,
    players.innings::SMALLINT as innings,
    CASE
        WHEN bat_innings.innings IS NULL THEN 0::SMALLINT
        ELSE 1::SMALLINT
    END AS played_in_match,
    players.player::VARCHAR as player,
    bat_stats.runs::SMALLINT as runs,
    bat_stats.balls_faced::SMALLINT as balls_faced,
    bat_stats.singles::SMALLINT as singles,
    bat_stats.doubles::SMALLINT as doubles,
    bat_stats.triples::SMALLINT as triples,
    bat_stats.fours::SMALLINT as fours,
    bat_stats.sixes::SMALLINT as sixes,
    case
        when bow_stats.player_out is not null then 1::SMALLINT
        else NULL
    end as player_out,
    bow_stats.out_type::VARCHAR as out_type,
    bow_stats.bowler::VARCHAR as bowler,
    bow_stats.bowler_wicket::SMALLINT as bowler_wicket,
    bow_stats.fielders_involved::VARCHAR as fielders_involved,
    CASE
        WHEN bat_stats.innings = 1 THEN m.team1_score::SMALLINT
        ELSE m.team2_score::SMALLINT
    END as team_score,
    CASE
        WHEN bat_stats.innings = 1 THEN m.team2_score::SMALLINT
        ELSE m.team1_score::SMALLINT
    END as opposition_score,
    CASE
        WHEN bat_stats.innings = 1 THEN m.team1::VARCHAR
        ELSE m.team2::VARCHAR
    END as team,
    CASE
        WHEN bat_stats.innings = 1 THEN m.team2::VARCHAR
        ELSE m.team1::VARCHAR
    END as opposition,
    CASE
        WHEN bat_stats.innings = 1
        AND m.toss_decision = 'bat' THEN 1::SMALLINT
        WHEN bat_stats.innings = 2
        AND m.toss_decision = 'field' THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as toss_won,
    CASE
        WHEN (
            bat_stats.innings = 1
            AND m.team_won = 1
        )
        OR (
            bat_stats.innings = 2
            AND m.team_won = 2
        ) THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as team_won
from (
        -- we can use this to count number of innings of a batsman
        select match_id,
            innings,
            batter as player
        from runs
        union
        select match_id,
            innings,
            non_striker as player
        from runs
    ) bat_innings
    left join (
        -- stats related to the batting
        select match_id,
            innings,
            batter,
            sum(batter_runs) as runs,
            SUM(
                CASE
                    WHEN wide > 0 THEN 0
                    ELSE 1
                END
            ) as balls_faced,
            SUM(
                CASE
                    WHEN batter_runs = 1 THEN 1
                    ELSE NULL
                END
            ) as singles,
            SUM(
                CASE
                    WHEN batter_runs = 2 THEN 1
                    ELSE NULL
                END
            ) as doubles,
            SUM(
                CASE
                    WHEN batter_runs = 3 THEN 1
                    ELSE NULL
                END
            ) as triples,
            SUM(
                CASE
                    WHEN boundaries = 4 THEN 1
                    ELSE NULL
                END
            ) as fours,
            SUM(
                CASE
                    WHEN boundaries = 6 THEN 1
                    ELSE NULL
                END
            ) as sixes
        FROM runs
        GROUP BY match_id,
            innings,
            batter
    ) bat_stats on bat_stats.match_id = bat_innings.match_id
    and bat_stats.innings = bat_innings.innings
    and bat_stats.batter = bat_innings.player
    left join (
        -- bowling related stats
        select match_id,
            innings,
            wicket as player_out,
            out_type,
            bowler,
            bowler_wicket,
            fielders_involved
        from runs
        where wicket is not null
    ) bow_stats on bow_stats.match_id = bat_innings.match_id
    and bow_stats.innings = bat_innings.innings
    and bow_stats.player_out = bat_innings.player -- we are doing right join to get all the players present in the match; from here we can get number of matches
    right join players on players.match_id = bat_innings.match_id
    and players.player = bat_innings.player
    left join (
        -- match related stats
        select season,
            match_id,
            toss_decision,
            case
                when team_won = team1 then 1
                else 2
            end as team_won,
            team1,
            team2,
            team1_score,
            team2_score
        from matches
    ) m on m.match_id = players.match_id;"
