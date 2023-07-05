# TODO

- [x] create table using tanstack
- [x] added types to SummaryTable.tsx, data.ts, getColumnsForSummaryTable.ts files
- [x] style table
  - fixing header to top, fixing player column
  - border for the first column using `before` pseudo element
  - size changes when `sm:`
  - fixed the column's width issues
- [x] add position data in the api
  - tried to include this data in the SQL query using ROW_NUMBER but was not able to do it
  - so have included this data while returning data in the router functions
  - modified the schemas to include pos column
- [x] modify table to include position data
  - added position column to the table
- [x] modify seasons in mongodb so that they consist of only one year (eg. 2009/10 => 2010)
- [x] include all seasons in the filter
  - added all seasons to data.ts file
  - **TODO** : currently providing seasons manually, try to fetch them from the server
- [x] stablize the stats in api
  - [x] batter stats
    - have chosen min 100runs for some stats such as avg, sr
    - added limit and havingFilter variables in batterSQLHelper to have a single point change for all stats
  - [x] bowler stats
    - have chosen min 60balls for some stats such as avg, sr, dots %
    - added limit and havingFilter variables in batterSQLHelper to have a single point change for all stats
- [x] add high score to the batter stats in api
- [] add best bowling, dot-ball % to the bowler stats in api
  - [x] add dot-ball %
- [x] add out/not-out for high score to the batter stats in api & front-end
  - added out/not-out along with team and opponent columns for HS table
  - modified the SQL helper for batter
- [] modify the SQL helper so that it's in sync with the style of batter
- [x] give some visual style for the selected stat in the table
  - had to modify api to include selected column position inside table
  - removed duplicate code in api
  - **TODO** : functionality is ok, but the styling has to be improved
- [x] modify the filter order for the bowling selection so that it matches with batting stats
- [x] do something to sync the order of columns betweem sqlhelper and schemas
  - the order doesn't depend on the select statements, it entirely depends on schemas of response models
- [] add D/L method in matches table => mongodb
- [] add overs played in matches table => mongodb
- [] balls_faced shouldn't be null when played_in_match is set to 1 in batter_stats table => mongodb
- [] add shortcut team details to the summary table
- [] add details about the qualification for some stats such as avg,sr => react