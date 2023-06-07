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