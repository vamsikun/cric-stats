-- size of each column in runs table
select sum(pg_column_size(match_id)) / pg_table_size('runs')::float as match_id,
    sum(pg_column_size(season)) / pg_table_size('runs')::float as season,
    sum(pg_column_size(over)) / pg_table_size('runs')::float as over,
    sum(pg_column_size(ball_no)) / pg_table_size('runs')::float as ball_no,
    sum(pg_column_size(innings)) / pg_table_size('runs')::float as innings,
    sum(pg_column_size(batter)) / pg_table_size('runs')::float as batter,
    sum(pg_column_size(non_striker)) / pg_table_size('runs')::float as non_striker,
    sum(pg_column_size(bowler)) / pg_table_size('runs')::float as bowler,
    sum(pg_column_size(batter_runs)) / pg_table_size('runs')::float as batter_runs,
    sum(pg_column_size(extra_runs)) / pg_table_size('runs')::float as extra_runs,
    sum(pg_column_size(wide)) / pg_table_size('runs')::float as wide,
    sum(pg_column_size(noball)) / pg_table_size('runs')::float as noball,
    sum(pg_column_size(penalty)) / pg_table_size('runs')::float as penalty,
    sum(pg_column_size(wicket)) / pg_table_size('runs')::float as wicket,
    sum(pg_column_size(out_type)) / pg_table_size('runs')::float as out_type,
    sum(pg_column_size(fielders_involved)) / pg_table_size('runs')::float as fielders_involved,
    sum(pg_column_size(bowler_wicket)) / pg_table_size('runs')::float as bowler_wicket,
    sum(pg_column_size(boundaries)) / pg_table_size('runs')::float as boundaries
from runs;
-- size of each column in batter_stats_each_match table
select sum(pg_column_size(team_won)) / pg_table_size('batter_stats_each_match')::float as team_won,
    sum(pg_column_size(match_id)) / pg_table_size('batter_stats_each_match')::float as match_id,
    sum(pg_column_size(innings)) / pg_table_size('batter_stats_each_match')::float as innings,
    sum(pg_column_size(team_score)) / pg_table_size('batter_stats_each_match')::float as team_score,
    sum(pg_column_size(opposition_score)) / pg_table_size('batter_stats_each_match')::float as opposition_score,
    sum(pg_column_size(team)) / pg_table_size('batter_stats_each_match')::float as team,
    sum(pg_column_size(opposition)) / pg_table_size('batter_stats_each_match')::float as opposition,
    sum(pg_column_size(toss_won)) / pg_table_size('batter_stats_each_match')::float as toss_won,
    sum(pg_column_size(runs)) / pg_table_size('batter_stats_each_match')::float as runs,
    sum(pg_column_size(over)) / pg_table_size('batter_stats_each_match')::float as over,
    sum(pg_column_size(balls_faced)) / pg_table_size('batter_stats_each_match')::float as balls_faced,
    sum(pg_column_size(singles)) / pg_table_size('batter_stats_each_match')::float as singles,
    sum(pg_column_size(doubles)) / pg_table_size('batter_stats_each_match')::float as doubles,
    sum(pg_column_size(triples)) / pg_table_size('batter_stats_each_match')::float as triples,
    sum(pg_column_size(fours)) / pg_table_size('batter_stats_each_match')::float as fours,
    sum(pg_column_size(sixes)) / pg_table_size('batter_stats_each_match')::float as sixes,
    sum(pg_column_size(bowler_wicket)) / pg_table_size('batter_stats_each_match')::float as bowler_wicket,
    sum(pg_column_size(player)) / pg_table_size('batter_stats_each_match')::float as player,
    sum(pg_column_size(out_type)) / pg_table_size('batter_stats_each_match')::float as out_type,
    sum(pg_column_size(bowler)) / pg_table_size('batter_stats_each_match')::float as bowler,
    sum(pg_column_size(season)) / pg_table_size('batter_stats_each_match')::float as season,
    sum(pg_column_size(fielders_involved)) / pg_table_size('batter_stats_each_match')::float as fielders_involved
from batter_stats_each_match;
-- size of each table in ipl database
select pg_table_size('matches') as matches,
    pg_table_size('runs') as runs,
    pg_table_size('players') as players,
    pg_table_size('partnerships') as partnerships,
    pg_table_size('batter_stats_each_match') as batter_stats_each_match,
    pg_table_size('bowler_stats_each_match') as bowler_stats_each_match,
    pg_database_size('ipl') as ipl;
-- batter stats
-- add death over, powerplay stats
CREATE TABLE batter_stats_each_match as
select m.season as season,
    bs.match_id::INTEGER as match_id,
    bs.innings::SMALLINT as innings,
    bs.batter::VARCHAR as player,
    bs.runs::SMALLINT as runs,
    bs.balls_faced::SMALLINT as balls_faced,
    bs.singles::SMALLINT as singles,
    bs.doubles::SMALLINT as doubles,
    bs.triples::SMALLINT as triples,
    bs.fours::SMALLINT as fours,
    bs.sixes::SMALLINT as sixes,
    bw.out_type::VARCHAR as out_type,
    bw.bowler::VARCHAR as bowler,
    bw.bowler_wicket::SMALLINT as bowler_wicket,
    bw.fielders_involved::VARCHAR as fielders_involved,
    CASE
        WHEN bs.innings = 1 THEN m.team1_score::SMALLINT
        ELSE m.team2_score::SMALLINT
    END as team_score,
    CASE
        WHEN bs.innings = 1 THEN m.team2_score::SMALLINT
        ELSE m.team1_score::SMALLINT
    END as opposition_score,
    CASE
        WHEN bs.innings = 1 THEN m.team1::VARCHAR
        ELSE m.team2::VARCHAR
    END as team,
    CASE
        WHEN bs.innings = 1 THEN m.team2::VARCHAR
        ELSE m.team1::VARCHAR
    END as opposition,
    CASE
        WHEN bs.innings = 1
        AND m.toss_decision = 'bat' THEN 1::SMALLINT
        WHEN bs.innings = 2
        AND m.toss_decision = 'field' THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as toss_won,
    CASE
        WHEN (
            bs.innings = 1
            AND m.team_won = 1
        )
        OR (
            bs.innings = 2
            AND m.team_won = 2
        ) THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as team_won
from (
        select match_id,
            innings,
            batter,
            sum(batter_runs) as runs,
            count(*) as balls_faced,
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
    ) bs
    left join (
        select match_id,
            innings,
            wicket as player_out,
            out_type,
            bowler,
            bowler_wicket,
            fielders_involved
        from runs
        where wicket is not null
    ) bw on bs.match_id = bw.match_id
    and bs.innings = bw.innings
    and bs.batter = bw.player_out
    left join (
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
    ) m on bs.match_id = m.match_id;
-- bowler stats
-- add death over, powerplay stats
select m.season::VARCHAR as season,
    bs.match_id::INTEGER as match_id,
    bs.innings::SMALLINT as innings,
    bs.bowler::VARCHAR as player,
    bs.legal_deliveries::SMALLINT as legal_deliveries,
    bs.dot_balls::SMALLINT as dot_balls,
    bs.runs_conceded::SMALLINT as runs_conceded,
    bs.wickets::SMALLINT as wickets,
    bs.wides::SMALLINT as wides,
    bs.noballs::SMALLINT as noballs,
    bs.fours_conceded::SMALLINT as fours_conceded,
    bs.sixes_conceded::SMALLINT as sixes_conceded,
    bs.caught_wickets::SMALLINT as caught_wickets,
    bs.bowled_wickets::SMALLINT as bowled_wickets,
    bs.lbw_wickets::SMALLINT as lbw_wickets,
    bs.stumped_wickets::SMALLINT as stumped_wickets,
    bs.maiden_overs::SMALLINT as maiden_overs,
    CASE
        WHEN bs.innings = 1 THEN m.team2_score::SMALLINT
        ELSE m.team1_score::SMALLINT
    END as team_score,
    CASE
        WHEN bs.innings = 1 THEN m.team1_score::SMALLINT
        ELSE m.team2_score::SMALLINT
    END as opposition_score,
    CASE
        WHEN bs.innings = 1 THEN m.team2::VARCHAR
        ELSE m.team1::VARCHAR
    END as team,
    CASE
        WHEN bs.innings = 1 THEN m.team1::VARCHAR
        ELSE m.team2::VARCHAR
    END as opposition,
    CASE
        WHEN bs.innings = 1
        AND m.toss_decision = 'field' THEN 1::SMALLINT
        WHEN bs.innings = 2
        AND m.toss_decision = 'bat' THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as toss_won,
    CASE
        WHEN (
            bs.innings = 1
            AND m.team_won = 2
        )
        OR (
            bs.innings = 2
            AND m.team_won = 1
        ) THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as team_won
from (
        SELECT match_id,
            innings,
            bowler,
            SUM(legal_deliveries) AS legal_deliveries,
            SUM(dot_balls) AS dot_balls,
            SUM(runs_conceded) AS runs_conceded,
            SUM(wickets) AS wickets,
            SUM(wides) AS wides,
            SUM(noballs) AS noballs,
            SUM(fours_conceded) AS fours_conceded,
            SUM(sixes_conceded) AS sixes_conceded,
            SUM(caught_wickets) AS caught_wickets,
            SUM(bowled_wickets) AS bowled_wickets,
            SUM(lbw_wickets) AS lbw_wickets,
            SUM(stumped_wickets) AS stumped_wickets,
            SUM(maiden_over) AS maiden_overs
        FROM (
                -- get the over stats, we are doing this just for the maiden over
                -- TODO: can we do this in a better way?
                SELECT match_id,
                    innings,
                    bowler,
                    over,
                    SUM(
                        CASE
                            WHEN (
                                wide IS null
                                AND noball IS null
                            ) THEN 1
                            ELSE 0
                        END
                    ) AS legal_deliveries,
                    SUM(
                        CASE
                            WHEN (
                                wide IS null
                                AND noball IS null
                                AND batter_runs = 0
                            ) THEN 1
                            ELSE 0
                        END
                    ) AS dot_balls,
                    SUM(batter_runs) + COALESCE(SUM(wide), 0) + COALESCE(SUM(noball), 0) AS runs_conceded,
                    SUM(bowler_wicket) AS wickets,
                    SUM(
                        CASE
                            WHEN wide IS NULL THEN NULL
                            ELSE 1
                        END
                    ) AS wides,
                    SUM(
                        CASE
                            WHEN noball IS NULL THEN NULL
                            ELSE 1
                        END
                    ) AS noballs,
                    SUM(
                        CASE
                            WHEN boundaries = 4 THEN 1
                            ELSE NULL
                        END
                    ) AS fours_conceded,
                    SUM(
                        CASE
                            WHEN boundaries = 6 THEN 1
                            ELSE NULL
                        END
                    ) AS sixes_conceded,
                    SUM(
                        CASE
                            WHEN out_type = 'caught' THEN 1
                            ELSE NULL
                        END
                    ) AS caught_wickets,
                    SUM(
                        CASE
                            WHEN out_type = 'bowled' THEN 1
                            ELSE NULL
                        END
                    ) AS bowled_wickets,
                    SUM(
                        CASE
                            WHEN out_type = 'lbw' THEN 1
                            ELSE NULL
                        END
                    ) AS lbw_wickets,
                    SUM(
                        CASE
                            WHEN out_type = 'stumped' THEN 1
                            ELSE NULL
                        END
                    ) AS stumped_wickets,
                    CASE
                        WHEN (
                            SUM(batter_runs) + COALESCE(SUM(wide), 0) + COALESCE(SUM(noball), 0)
                        ) = 0
                        AND (
                            SUM(
                                CASE
                                    WHEN wide IS null
                                    AND noball IS null THEN 1
                                    ELSE 0
                                END
                            ) = 6
                        ) THEN 1
                        ELSE NULL
                    END AS maiden_over
                FROM runs
                GROUP BY match_id,
                    innings,
                    bowler,
                    over
            ) over_stats
        GROUP BY over_stats.match_id,
            innings,
            bowler
    ) bs
    left join (
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
    ) m on bs.match_id = m.match_id;