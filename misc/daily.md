# date: 2023-06-08

- order matters while creating index
  TODO: check for where clause
- we should always include the first column on the multi-column index in where or group by clause

# date: 2023-06-10

- amit mishra bowled 7 legal deliveries in an over on april 28th, 2009 in dd vs rr match
- penalty runs are not added under bowler's score

# date: 2023-06-11

- strike rate for bowler should be calculated after getting the groupby results on season, team or something else we cannot calculate strike rate for bowler in a single match and the same thing applies for average as well

# date: 2023-06-12

<!-- TODO: -->

- chris gayle's number of fours is not matching; somewhere we are missing one boundary in 2011 season

# date: 2023-06-13

<!-- TODO: -->

- should we store the match related stats in batter_stats and bowler_stats table or just do the group by when we call the api

# date: 2023-06-13

<!-- TODO: -->

- we can't directly divide the legal deliveries to get the total number of overs bowled; over has to be complete to get counted as one


# date: 2023-07-05
- don't forget to modify the sequence of columns in both sqlhelper and schema files