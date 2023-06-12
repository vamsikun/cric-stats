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

    return '''SELECT player,
                sum(runs) as runs,
                ROUND(sum(runs)::float/sum(balls_faced),2) as sr,
                ROUND(sum(runs)/NULLIF(sum(CASE WHEN out_type is not null THEN 1 ELSE 0 END),0),2) as avg,
                max(runs) as hs,
                sum(sixes) as sixes,
                sum(fours) as fours FROM batter_stats_each_match'''
