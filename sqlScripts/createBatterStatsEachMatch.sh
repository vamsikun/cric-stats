psql -d ipl -c "
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
      WHEN (bs.innings=1 AND m.team_won=1) OR (bs.innings=2 AND m.team_won=2)
          THEN 1::SMALLINT ELSE 0::SMALLINT END as team_won
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
            case when team_won=team1 then 1 else 0 end as team_won,
            team1,
            team2,
            team1_score,
            team2_score
        from matches
    ) m on bs.match_id = m.match_id;"
