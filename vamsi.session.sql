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
-- bowler stats
-- add death over, powerplay stats
select m.season::VARCHAR as season,
    players.match_id::INTEGER as match_id,
    players.player::VARCHAR as player,
    players.innings::SMALLINT as innings,
    CASE
        WHEN bs.bowler IS NULL THEN 0::SMALLINT
        ELSE 1::SMALLINT
    END AS bowled_in_match,
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
        WHEN players.innings = 1 THEN m.team2_score::SMALLINT
        ELSE m.team1_score::SMALLINT
    END as team_score,
    CASE
        WHEN players.innings = 1 THEN m.team1_score::SMALLINT
        ELSE m.team2_score::SMALLINT
    END as opposition_score,
    CASE
        WHEN players.innings = 1 THEN m.team2::SMALLINT
        ELSE m.team1::SMALLINT
    END as team,
    CASE
        WHEN players.innings = 1 THEN m.team1::SMALLINT
        ELSE m.team2::SMALLINT
    END as opposition,
    CASE
        WHEN players.innings = 1
        AND m.toss_decision = 'field' THEN 1::SMALLINT
        WHEN players.innings = 2
        AND m.toss_decision = 'bat' THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as toss_won,
    CASE
        WHEN (
            players.innings = 1
            AND m.team_won = 2
        )
        OR (
            players.innings = 2
            AND m.team_won = 1
        ) THEN 1::SMALLINT -- if the match is abandoned
        WHEN (m.team_won is NULL) THEN NULL
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
        GROUP BY match_id,
            innings,
            bowler
    ) bs
    right join (
        select match_id,
            case
                when innings = 2 then 1
                else 2
            end as innings,
            player
        from players
    ) players on players.match_id = bs.match_id
    and players.player = bs.bowler
    and players.innings = bs.innings
    left join (
        select season,
            match_id,
            toss_decision,
            case
                when team_won = team1 then 1
                when team_won = team2 then 2
                else null
            end as team_won,
            team1,
            team2,
            team1_score,
            team2_score
        from matches
    ) m on players.match_id = m.match_id;
-- modified batter stats
-- add death over and powerplay stats
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
    --- use players for the following as all the players won't be present in the bat_stats
    CASE
        WHEN players.innings = 1 THEN m.team1_score::SMALLINT
        ELSE m.team2_score::SMALLINT
    END as team_score,
    CASE
        WHEN players.innings = 1 THEN m.team2_score::SMALLINT
        ELSE m.team1_score::SMALLINT
    END as opposition_score,
    CASE
        WHEN players.innings = 1 THEN m.team1::SMALLINT
        ELSE m.team2::SMALLINT
    END as team,
    CASE
        WHEN players.innings = 1 THEN m.team2::SMALLINT
        ELSE m.team1::SMALLINT
    END as opposition,
    CASE
        WHEN players.innings = 1
        AND m.toss_decision = 'bat' THEN 1::SMALLINT
        WHEN players.innings = 2
        AND m.toss_decision = 'field' THEN 1::SMALLINT
        ELSE 0::SMALLINT
    END as toss_won,
    CASE
        WHEN (
            players.innings = 1
            AND m.team_won = 1
        )
        OR (
            players.innings = 2
            AND m.team_won = 2
        ) THEN 1::SMALLINT -- if the match is abandoned
        WHEN (m.team_won is NULL) THEN NULL
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
                when team_won = team2 then 2
                else null
            end as team_won,
            team1,
            team2,
            team1_score,
            team2_score
        from matches
    ) m on m.match_id = players.match_id;
select season,
    team1 as team,
    count(*) as matches,
    1 as innings,
    max(
        lpad(
            m_team1_score || '-' || lpad(CAST(team2 as text), 3, '0'),
            10,
            '0'
        )
    ) as high_score,
    min(
        CASE
            -- low_score is not considered when dls or overs_reduced happens or no_result
            WHEN team_won is not null
            and dls != 1
            and overs_reduced != 1 THEN lpad(
                m_team1_score || '-' || lpad(CAST(team2 as text), 3, '0'),
                10,
                '0'
            )
            ELSE 'ffffff'
        END
    ) as low_score,
    SUM(team1_score) as runs,
    SUM(team1_fours) as fours,
    SUM(team1_sixes) as sixes,
    SUM(team1_legal_deliveries_faced) as legal_deliveries_faced,
    SUM(team1_wickets) as wickets,
    max(
        lpad(
            m_team2_score || '-' || lpad(CAST(team2 as text), 3, '0'),
            9,
            '0'
        )
    ) as opp_high_score,
    min(
        CASE
            -- low_score is not considered when dls or overs_reduced happens or no_result
            WHEN team_won is not null
            and dls != 1
            and overs_reduced != 1 THEN lpad(
                m_team2_score || '-' || lpad(CAST(team2 as text), 3, '0'),
                9,
                '0'
            )
            ELSE 'ffffff'
        END
    ) as opp_low_score,
    SUM(team2_score) as opp_runs,
    SUM(team2_fours) as opp_fours,
    SUM(team2_sixes) as opp_sixes,
    SUM(team2_legal_deliveries_faced) as opp_legal_deliveries_faced,
    SUM(team2_wickets) as opp_wickets,
    SUM(
        CASE
            WHEN team_won = team1 THEN 1
            ELSE 0
        END
    ) AS wins,
    SUM(
        CASE
            WHEN team_won = team2 THEN 1
            ELSE 0
        END
    ) AS losses
from matches
group by season,
    team1
UNION
SELECT season,
    team2 as team,
    count(*) as matches,
    2 as innings,
    MAX(
        lpad(
            m_team2_score || '-' || lpad(CAST(team1 as text), 3, '0'),
            9,
            '0'
        )
    ) AS high_score,
    min(
        CASE
            -- low_score is not considered when dls or overs_reduced happens or no_result
            WHEN team_won is not null
            and dls != 1
            and overs_reduced != 1 THEN lpad(
                m_team2_score || '-' || lpad(CAST(team1 as text), 3, '0'),
                9,
                '0'
            )
            ELSE 'ffffff'
        END
    ) as low_score,
    SUM(team2_score) as runs,
    SUM(team2_fours) as fours,
    SUM(team2_sixes) as sixes,
    SUM(team2_legal_deliveries_faced) as legal_deliveries_faced,
    SUM(team2_wickets) as wickets,
    MAX(
        lpad(
            m_team1_score || '-' || lpad(CAST(team1 as text), 3, '0'),
            9,
            '0'
        )
    ) AS opp_high_score,
    min(
        CASE
            -- low_score is not considered when dls or overs_reduced happens or no_result
            WHEN team_won is not null
            and dls != 1
            and overs_reduced != 1 THEN lpad(
                m_team1_score || '-' || lpad(CAST(team1 as text), 3, '0'),
                9,
                '0'
            )
            ELSE 'ffffff'
        END
    ) as opp_low_score,
    SUM(team1_score) as opp_runs,
    SUM(team1_fours) as opp_fours,
    SUM(team1_sixes) as opp_sixes,
    SUM(team1_legal_deliveries_faced) as opp_legal_deliveries_faced,
    SUM(team1_wickets) as opp_wickets,
    SUM(
        CASE
            WHEN team_won = team2 THEN 1
            ELSE 0
        END
    ) AS wins,
    SUM(
        CASE
            WHEN team_won = team1 THEN 1
            ELSE 0
        END
    ) AS losses
FROM matches
GROUP BY season,
    team2