srCalculation = "ROUND(CAST( sum(runs) as numeric )/sum(balls_faced),4)*100 "
avgCalculation = "ROUND( CAST( sum(runs) as numeric)/NULLIF(sum(player_out),0) ,2) " 

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
                sum(runs) as runs,
                {srCalculation} as sr,
                {avgCalculation} as avg,
                max(runs) as hs,
                sum(sixes) as sixes,
                sum(fours) as fours FROM batter_stats_each_match'''
