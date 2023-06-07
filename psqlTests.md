### Following should return zero number of tuples
```sql
select * from runs
where batter_runs<>0 and wide<>0;
```