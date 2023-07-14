<!-- following gets batter runs for each innings -->

```sql
DROP materialized view IF EXISTS player_stats;
CREATE materialized view player_stats as
select bs.season as season,
    bs.match_id as match_id,
    bs.innings as innings,
    bs.batter as player,
    bs.runs as runs,
    bs.balls_faced as balls_faced,
    bs.singles as singles,
    bs.doubles as doubles,
    bs.triples as triples,
    bs.fours as fours,
    bs.sixes as sixes,
    bw.out_type as out_type,
    bw.bowler as bowler,
    bw.bowler_wicket as bowler_wicket,
    bw.fielders_involved as fielders_involved,
    CASE
        WHEN bs.innings = "f" THEN m.team1_score
        ELSE m.team2_score
    END as team_score,
    CASE
        WHEN bs.innings = "f" THEN m.team2_score
        ELSE m.team1_score
    END as opposition_score,
    CASE
        WHEN bs.innings = "f" THEN m.team1
        ELSE m.team2
    END as team,
    CASE
        WHEN bs.innings = "f" THEN m.team2
        ELSE m.team1
    END as opposition,
    CASE
        WHEN bs.innings = "f"
        AND m.toss_decision = 'bat' THEN 1
        WHEN bs.innings = "t"
        AND m.toss_decision = 'field' THEN 1
        ELSE 0
    END as toss_won,
    m.team_won as team_won
from (
        select season,
            match_id,
            innings,
            batter,
            sum(batter_runs) as runs,
            count(*) as balls_faced,
            SUM(
                CASE
                    WHEN batter_runs = 1 THEN 1
                    ELSE 0
                END
            ) as singles,
            SUM(
                CASE
                    WHEN batter_runs = 2 THEN 1
                    ELSE 0
                END
            ) as doubles,
            SUM(
                CASE
                    WHEN batter_runs = 3 THEN 1
                    ELSE 0
                END
            ) as triples,
            SUM(
                CASE
                    WHEN boundaries = 4 THEN 1
                    ELSE 0
                END
            ) as fours,
            SUM(
                CASE
                    WHEN boundaries = 6 THEN 1
                    ELSE 0
                END
            ) as sixes
        FROM runs
        GROUP BY season,
            match_id,
            innings,
            batter
    ) bs
    left join (
        select season,
            match_id,
            innings,
            wicket as player_out,
            out_type,
            bowler,
            bowler_wicket,
            fielders_involved
        from runs
        where wicket is not null
    ) bw on bs.season = bw.season
    and bs.match_id = bw.match_id
    and bs.innings = bw.innings
    and bs.batter = bw.player_out
    left join (
        select season,
            match_id,
            toss_decision,
            team_won,
            team1,
            team2,
            team1_score,
            team2_score
        from matches
    ) m on bs.season = m.season
    and bs.match_id = m.match_id;
```

<!-- Player Stats Summary-->
<!-- NOTE: have added `out` column to check whether a batsman is out or notout on the highest score -->

```sql
select player_stats_summary.*, player_stats.out_type as out from (select season, innings, player, team, opposition,
	sum(runs) as runs,
	sum(balls_faced) as balls_faced,
	ROUND(sum(runs)/sum(balls_faced)*100,0) as SR,
	max(runs) as HS,
	sum(case when out_type is null then 0 else 1 end) as outs

from player_stats
group by season, innings,team, opposition, player
order by runs desc) player_stats_summary
left join
player_stats on player_stats_summary.season=player_stats.season
			and player_stats_summary.innings=player_stats.innings
			and player_stats_summary.team=player_stats.team
			and player_stats_summary.opposition=player_stats.opposition
			and player_stats_summary.player=player_stats.player
			and player_stats_summary.HS=player_stats.runs
order by HS desc
```

<!-- Player Stats Summary -->
<!-- NOTE: doesn't have `out` column for HS innings -->

```sql
select season, innings, player, team, opposition,
	sum(runs) as runs,
	sum(balls_faced) as balls_faced,
	ROUND(sum(runs)/sum(balls_faced)*100,0) as SR,
	max(runs) as HS,
	sum(case when out_type is null then 0 else 1 end) as outs

from player_stats
group by season, innings,team, opposition, player
order by runs desc
```

### Following is used to check the table size

```sql
select pg_table_size('matches') as matches,
		pg_table_size('runs') as runs,
    pg_table_size('players') as players,
    pg_table_size('partnerships') as partnerships,
    pg_table_size('batter_stats_each_match') as batter_stats_each_match;
```
