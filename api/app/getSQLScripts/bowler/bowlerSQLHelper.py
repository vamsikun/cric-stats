overCalculation = "CAST(CAST( SUM( legal_deliveries )/6 AS VARCHAR)||'.'||CAST( SUM( legal_deliveries )%6 AS VARCHAR) AS numeric)"
srCalculation = "ROUND(CAST(SUM(legal_deliveries)::float/SUM(wickets) as NUMERIC),2)"
avgCalculation = "ROUND(CAST(SUM(runs_conceded)::float/SUM(wickets) as NUMERIC),2)"
econCalculation = "ROUND( CAST( SUM(runs_conceded)*6.0/SUM(legal_deliveries) as NUMERIC) ,2)"
def getWherePredicate(season, team, innings, opposition):
    wherePredicate = ""
    if season or team or innings or opposition:
        wherePredicate += " WHERE "
    if season:
        wherePredicate += f"season = '{season}' AND "
    if team:
        wherePredicate += f"team = '{team}' AND "
    if innings:
        wherePredicate += f"innings = {innings} AND "
    if opposition:
        wherePredicate += f"opposition = '{opposition}' AND "

    if wherePredicate.endswith(" AND "):
        wherePredicate = wherePredicate[:-5]
    return wherePredicate


def getSelectStatement():

    return f'''SELECT player,
                COUNT(*) AS matches,
                SUM(bowled_in_match) AS innings,
                {overCalculation} as overs,
                SUM(wickets) as wickets,
                SUM(runs_conceded) as runs,
                {srCalculation} as sr,
                {avgCalculation} as avg,
                {econCalculation} as econ
                FROM bowler_stats_each_match
                '''
