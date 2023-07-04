srCalculation = "ROUND(CAST( SUM(runs) AS numeric )/SUM(balls_faced),4)*100 "
avgCalculation = "ROUND( CAST( SUM(runs) AS numeric)/NULLIF(SUM(player_out),0) ,2) "
limit = 10
# NOTE: minimum qualification for stats such as average, strikerate
havingFilter = "HAVING SUM(runs)>=100"


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
    return f"""SELECT player,
                COUNT(*) AS matches,
                SUM(played_in_match) AS innings,
                SUM(runs) AS runs,
                {srCalculation} AS sr,
                {avgCalculation} AS avg,
                MAX(runs) AS hs,
                SUM(sixes) AS sixes,
                SUM(fours) AS fours FROM batter_stats_each_match"""
