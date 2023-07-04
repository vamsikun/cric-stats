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
- [] include all seasons in the filter
