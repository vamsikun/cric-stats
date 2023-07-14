psql -d ipl -c "
CREATE TABLE bowler_stats_each_match AS
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
        ) THEN 1::SMALLINT
        -- if the match is abandoned
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
    ) m on players.match_id = m.match_id;"