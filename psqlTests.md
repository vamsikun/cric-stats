### Following should return zero number of tuples
```sql
select * from runs
where batter_runs<>0 and wide<>0;
```

### Following should return zero number of tuples
```sql
select * from runs
where fielders_involved like '%+%' and bowler_wicket<>0
```

### When we use objectID as the default match_id column

| matches | runs | players | partnerships | batter_stats_each_match | ipl |
|---------|------|---------|--------------|-------------------------|-----|
| 204800  | 28418048 | 2220032 | 1572864 | 16023552 | 56599331 |

### When we use SERIAL PRIMARY KEY as the match_id column

| matches | runs | players | partnerships | batter_stats_each_match | ipl |
|---------|------|---------|--------------|-------------------------|-----|
| 147456  | 23347200 | 1695744 | 1376256 | 14229504 | 48562979 |