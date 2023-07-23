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
- [ ] add best bowling, dot-ball % to the bowler stats in api
  - [x] add dot-ball %
- [x] add out/not-out for high score to the batter stats in api & front-end
  - added out/not-out along with team and opponent columns for HS table
  - modified the SQL helper for batter
- [x] modify the SQL helper so that it's in sync with the style of batter
- [x] give some visual style for the selected stat in the table
  - had to modify api to include selected column position inside table
  - removed duplicate code in api
  - **TODO** : functionality is ok, but the styling has to be improved
- [x] modify the filter order for the bowling selection so that it matches with batting stats
- [x] do something to sync the order of columns betweem sqlhelper and schemas
  - the order doesn't depend on the select statements, it entirely depends on schemas of response models
- [x] add D/L in matches table => mongodb
  - added DLS column based on the info.outcome.method key
  - added oversReduced column if the overs are reduced before even match starts
- [ ] add info about exclusion DLS and oversReduced matches when calculating lowest score for teams
- [x] add overs played in matches table => mongodb
  - added number of legal deliveries faced by each team in the matches table
- [ ] balls_faced shouldn't be null when played_in_match is set to 1 in batter_stats table => mongodb
- [x] add shortcut team details to the summary table => sql
  - replaced Pune Warriors with Pune Warriors India
  - added team_shortcut column to teams table
  - modified the style of batter and bowler apis
- [x] add details about the qualification for some stats such as avg,sr => react
  - [x] added that detail to the api response
    - modified the api styles
  - [x] have to make use of it in the front-end => react
    - learned about some useful flex-width and overflow properties
- [ ] for batter strike rate min.balls faced instead of min.runs??
- [ ] add type for metadata
- [ ] try to remove $expr in mongodb commands => mongodb
- [x] add modified team-score so that it becomes easy to get max, min score along with wickets => mongodb, sql
- [ ] remove files from gitignore
- [x] use reducer for maintaing multiple states connected with each other
- [x] reusable CustomFilter and Summary Table
- [x] add team summary table
- [x] modify high-score and low-score to readable format
- [x] modify the font of filters and double-button, so that they don't take the attention of the real-data
- [x] fix the area for table, so when the content is less, then items below won't jump to the space created by the table
- [x] normalize the margins for filters, table
  - added only the top-margin to avoid confusion with merge overlaps
- [x] add opponent team names for high and low scores for team summary
  - added another character in the score's columns that specifies the opp team id
  - modifed modifyScore function to return team info too
- [ ] add shadow to filters when we hover on them
- [x] add redis cache to fastapi
  - had to run redis-server daemon in the docker
  - modify dockerfile and create a separate script for running daemons
  - issues with nested dictionaries
  - **TODO** : optimize json.loads, json.dumps, json_encoder
- [ ] add client-side caching in nextjs using useSWR
  - [x] added useSWR to both playerSummary and teamSummary
  - **TODO** : in the playerSummary when `useSWR` is used along with `useEffect` on `playerType` dependency, it was giving error after changing the bowling/batting filter four times; check what's happening there..
  - [ ] add types for newly added reducers
- [x] create a skeleton table
  - [x] add skeleton table for initial loading
  - [x] modify opacity and add loading ui for table
  - **TODO** : can we make use of nextjs loading ui for this??
- [x] add some space around the table for small sizes
  - added padding to the summary table container
- [x] when filter is changed get the scroll position to the initial position
  - have used ref for table and for the selected column, then calculated the amount of distance to scroll
- [ ] modify colors for dark mode
  - [x] modify the background color
  - [x] modify the table color
  - [ ] have to update the filter color so that it doesn't overlap with the table
- [x] modify the column widths for player HS filter
  - no need normalized all widths of the table
- [ ] provide an option to take the screenshot of the entire table in the mobile mode
- [ ] 2010 avg batting giving response validation error
- [x] add type of apiData
- [ ] hide the options from filter when we click anywhere on the screen
- [ ] try to increase the height of the table so that we can give some space to the info
- [ ] align high score column
- [ ] can we add came till which stage for team performance
