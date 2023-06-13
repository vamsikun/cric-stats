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

### When we remove the season column from runs and partnership table, as that info is already present in match_id
 | matches | runs | players | partnerships | batter_stats_each_match | ipl |
 |---------|------|---------|--------------|-------------------------|-----|
 | 147456  | 21757952 | 1728512 | 1327104 | 14262272 | 46866947 |

 ### When we modify batter_stats table to include player data each match and updating team from names to integers
| matches | runs | players | partnerships | batter_stats_each_match | ipl |
|---------|------|---------|--------------|-------------------------|-----|
| 172032  | 20922368 | 1777664 | 1327104 | 2334720 | 35636003 |